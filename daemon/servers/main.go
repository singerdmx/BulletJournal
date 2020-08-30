package main

import (
	"context"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/dao"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	generator "github.com/singerdmx/BulletJournal/daemon/utils"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	scheduler "github.com/zywangzy/JobScheduler"
	"google.golang.org/grpc"
	"upper.io/db.v3/postgresql"
)

const (
	RequestIDKey string = "requestID"
)

var (
	logger logging.Logger
)

// server should implement services.UnimplementedDaemonServer's methods
type server struct {
	serviceConfig *config.Config
	subscriptions map[string]chan uint
}

// Send implements the JoinGroupEvents rpc endpoint of services.DaemonServer
func (s *server) JoinGroupEvents(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	logger.Printf("Received rpc request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

// Rest implements the Rest rest->rpc endpoint of services.DaemonServer
func (s *server) Rest(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	logger.Printf("Received request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

func (s *server) SubscribeNotification(subscribe *types.SubscribeNotification, stream services.Daemon_SubscribeNotificationServer) error {
	logger.Printf("Received rpc request for subscription: %s", subscribe.String())
	if _, ok := s.subscriptions[subscribe.Id]; ok {
		logger.Printf("Subscription: %s's streaming has been idle, start streaming!", subscribe.String())
		receiver := s.subscriptions[subscribe.Id]
		delete(s.subscriptions, subscribe.Id)
		//Keep the subscription session alive
		for {
			if _, idle := s.subscriptions[subscribe.Id]; !idle {
				projectId := strconv.Itoa(int(<-receiver))
				if projectId == "0" {
					logger.Printf("Closing streaming to subscription: %s", subscribe.String())
					break
				} else if err := stream.Send(&types.StreamMessage{Message: projectId}); err != nil {
					logger.Printf("Unexpected error happened to subscription: %s, error: %v", subscribe.String(), err)
					s.subscriptions[subscribe.Id] = receiver
					logger.Printf("Transition streaming to idle for subscription: %s", subscribe.String())
				} else {
					logger.Printf("Streaming projectId: %s to subscription: %s", projectId, subscribe.String())
				}
			} else {
				logger.Printf("Subscription: %s's streaming has been idle due to previous error", subscribe.String())
				break
			}
		}
	} else {
		logger.Printf("Subscription %s is streaming!", subscribe.String())
	}
	return nil
}

// AttachRequestID will attach a brand new request ID to a http request
func AssignRequestID(ctx context.Context) context.Context {

	requestID := generator.GenerateUID()

	return context.WithValue(ctx, RequestIDKey, requestID)
}

// GetRequestID will get reqID from a http request and return it as a string
func GetRequestID(ctx context.Context) string {

	reqID := ctx.Value(RequestIDKey)

	if ret, ok := reqID.(string); ok {
		return ret
	}

	return ""
}

func init() {
	config.InitConfig()
	logging.InitLogging(config.GetEnv())
}

func main() {

	ctx := context.Background()
	ctx = AssignRequestID(ctx)
	logger = logging.WithFields(logging.Fields{RequestIDKey: GetRequestID(ctx)})

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	receiver := make(chan uint, 100)
	daemonRpc := &server{serviceConfig: config.GetConfig(), subscriptions: map[string]chan uint{"cleaner": receiver}}

	rpcPort := ":" + daemonRpc.serviceConfig.RPCPort
	lis, err := net.Listen("tcp", rpcPort)
	if err != nil {
		logger.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, daemonRpc)

	gatewayMux := runtime.NewServeMux()
	endpoint := daemonRpc.serviceConfig.Host + rpcPort
	err = services.RegisterDaemonHandlerFromEndpoint(ctx, gatewayMux, endpoint, []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		logger.Fatalf("failed to register rpc server to gateway server: %v", err)
	}

	httpAddr := ":" + daemonRpc.serviceConfig.HttpPort
	httpServer := &http.Server{Addr: httpAddr, Handler: gatewayMux}

	//// Serve the swagger-ui and swagger file
	//mux := http.NewServeMux()
	//mux.Handle("/", rmux)
	//mux.HandleFunc("/swagger.json", serveSwagger)
	//fs := http.FileServer(http.Dir("www/swagger-ui"))
	//mux.Handle("/swagger-ui/", http.StripPrefix("/swagger-ui", fs))

	go func() {
		logger.Infof("rpc server running at port [%v]", daemonRpc.serviceConfig.RPCPort)
		if err := rpcServer.Serve(lis); err != nil {
			logger.Fatalf("rpc server failed to serve: %v", err)
		}
	}()

	go func() {
		logger.Infof("http server running at port [%v]", daemonRpc.serviceConfig.HttpPort)
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := httpServer.ListenAndServe(); err != nil {
			logger.Fatalf("http server failed to serve: %v", err)
		}
	}()

	jobScheduler := scheduler.NewJobScheduler()
	jobScheduler.Start()
	cleaner := dao.Cleaner{
		Receiver: receiver,
		Settings: postgresql.ConnectionURL{
			Host:     daemonRpc.serviceConfig.Host + ":" + daemonRpc.serviceConfig.DBPort,
			Database: daemonRpc.serviceConfig.Database,
			User:     daemonRpc.serviceConfig.Username,
			Password: daemonRpc.serviceConfig.Password,
		},
	}
	jobScheduler.AddRecurrentJob(
		func(...interface{}) {
			cleaner.Clean(daemonRpc.serviceConfig.MaxRetentionTimeInDays)
		},
		time.Now(),
		time.Second*time.Duration(daemonRpc.serviceConfig.IntervalInSeconds),
	)

	<-shutdown
	logger.Infof("Shutdown signal received")
	cleaner.Close()
	jobScheduler.Stop()
	logger.Infof("JobScheduler stopped")
	rpcServer.GracefulStop()
	logger.Infof("rpc server stopped")
	if httpServer.Shutdown(ctx) != nil {
		logger.Fatalf("failed to stop http server: %v", err)
	} else {
		logger.Infof("http server stopped")
	}
}
