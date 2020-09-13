package main

import (
	"context"
	"github.com/singerdmx/BulletJournal/daemon/middleware"
	"google.golang.org/grpc/metadata"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/dao"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	uid "github.com/singerdmx/BulletJournal/daemon/utils"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	scheduler "github.com/zywangzy/JobScheduler"
	"google.golang.org/grpc"
	"upper.io/db.v3/postgresql"
)



var (
	log logging.Logger
)

// server should implement services.UnimplementedDaemonServer's methods
type server struct {
	serviceConfig *config.Config
	subscriptions map[string]chan uint
}

// HealthCheck implements the rest endpoint healthcheck -> rpc
func (s *server) HealthCheck(ctx context.Context, request *types.HealthCheckRequest) (*types.HealthCheckResponse, error) {
	log.Printf("Received request: %v", request.String())
	return &types.HealthCheckResponse{}, nil
}

// Send implements the JoinGroupEvents rpc endpoint of services.DaemonServer
func (s *server) JoinGroupEvents(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	log.Printf("Received rpc request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

// Rest implements the Rest rest->rpc endpoint of services.DaemonServer
func (s *server) Rest(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	if meta, ok := metadata.FromIncomingContext(ctx); ok {
		if requestId, ok := meta[strings.ToLower(middleware.RequestIDKey)]; ok {
			log.Printf(middleware.RequestIDKey+": %v", requestId[0])
			grpc.SendHeader(ctx, metadata.Pairs(middleware.RequestIDKey, requestId[0]))
		} else {
			requestId := uid.GenerateUID()
			log.Printf(middleware.RequestIDKey+": %v", requestId)
			grpc.SendHeader(ctx, metadata.Pairs(middleware.RequestIDKey, requestId))
		}
	}
	log.Printf("Received request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

func (s *server) SubscribeNotification(subscribe *types.SubscribeNotification, stream services.Daemon_SubscribeNotificationServer) error {
	log.Printf("Received rpc request for subscription: %s", subscribe.String())
	if _, ok := s.subscriptions[subscribe.Id]; ok {
		log.Printf("Subscription: %s's streaming has been idle, start streaming!", subscribe.String())
		receiver := s.subscriptions[subscribe.Id]
		delete(s.subscriptions, subscribe.Id)
		//Keep the subscription session alive
		for {
			if _, idle := s.subscriptions[subscribe.Id]; !idle {
				projectId := strconv.Itoa(int(<-receiver))
				if projectId == "0" {
					log.Printf("Closing streaming to subscription: %s", subscribe.String())
					break
				} else if err := stream.Send(&types.StreamMessage{Message: projectId}); err != nil {
					log.Printf("Unexpected error happened to subscription: %s, error: %v", subscribe.String(), err)
					s.subscriptions[subscribe.Id] = receiver
					log.Printf("Transition streaming to idle for subscription: %s", subscribe.String())
				} else {
					log.Printf("Streaming projectId: %s to subscription: %s", projectId, subscribe.String())
				}
			} else {
				log.Printf("Subscription: %s's streaming has been idle due to previous error", subscribe.String())
				break
			}
		}
	} else {
		log.Printf("Subscription %s is streaming!", subscribe.String())
	}
	return nil
}

func init() {
	logging.InitLogging(config.GetEnv())
	log = *logging.GetLogger()
}

func main() {

	ctx := context.Background()
	log.WithContext(ctx)

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	receiver := make(chan uint, 100)
	daemonRpc := &server{serviceConfig: config.GetConfig(), subscriptions: map[string]chan uint{"cleaner": receiver}}

	rpcPort := ":" + daemonRpc.serviceConfig.RPCPort
	lis, err := net.Listen("tcp", rpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, daemonRpc)

	gatewayMux := runtime.NewServeMux(runtime.WithIncomingHeaderMatcher(middleware.IncomingHeaderMatcher), runtime.WithOutgoingHeaderMatcher(middleware.OutgoingHeaderMatcher),)
	endpoint := daemonRpc.serviceConfig.Host + rpcPort
	err = services.RegisterDaemonHandlerFromEndpoint(ctx, gatewayMux, endpoint, []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("failed to register rpc server to gateway server: %v", err)
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
		log.Infof("rpc server running at port [%v]", daemonRpc.serviceConfig.RPCPort)
		if err := rpcServer.Serve(lis); err != nil {
			log.Fatalf("rpc server failed to serve: %v", err)
		}
	}()

	go func() {
		log.Infof("http server running at port [%v]", daemonRpc.serviceConfig.HttpPort)
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatalf("http server failed to serve: %v", err)
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
	log.Infof("Shutdown signal received")
	cleaner.Close()
	jobScheduler.Stop()
	log.Infof("JobScheduler stopped")
	rpcServer.GracefulStop()
	log.Infof("rpc server stopped")
	if httpServer.Shutdown(ctx) != nil {
		log.Fatalf("failed to stop http server: %v", err)
	} else {
		log.Infof("http server stopped")
	}
}
