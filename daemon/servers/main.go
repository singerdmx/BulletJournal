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
	logging "github.com/singerdmx/BulletJournal/daemon/logging"
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

var (
	projectId     chan uint
	serviceConfig *config.Config
	subscriptions map[string]services.Daemon_SubscribeNotificationServer
)

// server should implement services.UnimplementedDaemonServer's methods
type server struct {
}

// Send implements the JoinGroupEvents rpc endpoint of services.DaemonServer
func (s *server) JoinGroupEvents(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	log.Printf("Received rpc request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

// Rest implements the Rest rest->rpc endpoint of services.DaemonServer
func (s *server) Rest(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	log.Printf("Received request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

func (s *server) SubscribeNotification(subscribe *types.SubscribeNotification, stream services.Daemon_SubscribeNotificationServer) error {
	log.Printf("Received rpc request for subscription: %s", subscribe.String())
	if _, ok := subscriptions[subscribe.Id]; !ok {
		//Add subscription
		subscriptions[subscribe.Id] = stream
		//Keep the subscription session alive
		for {
			if _, ok := subscriptions[subscribe.Id]; ok {
				if err := subscriptions[subscribe.Id].Send(&types.StreamMessage{Message: strconv.Itoa(int(<-projectId))}); err != nil {
					log.Printf("Unexpected error happened to subscribtion: %s, error: %v", subscribe.String(), err)
					delete(subscriptions, subscribe.Id)
					log.Printf("Stop streaming to subscribtion: %s", subscribe.String())
				} else {
					log.Printf("Sent data to subscribtion: %s", subscribe.String())
				}
			} else {
				log.Printf("Subscription: %s has been removed", subscribe.String())
				break
			}
		}
	} else {
		//Skip subscription
		log.Printf("Subscription already exists!")
	}
	return nil
}

// AttachRequestID will attach a brand new request ID to a http request
func AssignRequestID(ctx context.Context) context.Context {
	requestID := uid.GenerateUID()
	return context.WithValue(ctx, logging.RequestIDKey, requestID)
}

func init() {
	config.InitConfig()
	serviceConfig = config.GetConfig()
	logging.InitLogging(config.GetEnv())
	log = *logging.GetLogger()

	subscriptions = map[string]services.Daemon_SubscribeNotificationServer{}
	projectId = make(chan uint, 1)
}

func main() {
	ctx := context.Background()
	ctx = AssignRequestID(ctx)
	log.WithContext(ctx)

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	rpcPort := ":" + serviceConfig.RPCPort
	lis, err := net.Listen("tcp", rpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, &server{})

	gatewayMux := runtime.NewServeMux()
	endpoint := serviceConfig.Host + rpcPort
	err = services.RegisterDaemonHandlerFromEndpoint(ctx, gatewayMux, endpoint, []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("failed to register rpc server to gateway server: %v", err)
	}

	httpAddr := ":" + serviceConfig.HttpPort
	httpServer := &http.Server{Addr: httpAddr, Handler: gatewayMux}

	//// Serve the swagger-ui and swagger file
	//mux := http.NewServeMux()
	//mux.Handle("/", rmux)
	//mux.HandleFunc("/swagger.json", serveSwagger)
	//fs := http.FileServer(http.Dir("www/swagger-ui"))
	//mux.Handle("/swagger-ui/", http.StripPrefix("/swagger-ui", fs))

	go func() {
		log.Infof("rpc server running at port [%v]", serviceConfig.RPCPort)
		if err := rpcServer.Serve(lis); err != nil {
			log.Fatalf("rpc server failed to serve: %v", err)
		}
	}()

	go func() {
		log.Infof("http server running at port [%v]", serviceConfig.HttpPort)
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatalf("http server failed to serve: %v", err)
		}
	}()

	jobScheduler := scheduler.NewJobScheduler()
	jobScheduler.Start()
	jobScheduler.AddRecurrentJob(
		func(...interface{}) {
			cleaner := dao.Cleaner{
				Receiver: projectId,
				Settings: postgresql.ConnectionURL{
					Host:     serviceConfig.Host + ":" + serviceConfig.DBPort,
					Database: serviceConfig.Database,
					User:     serviceConfig.Username,
					Password: serviceConfig.Password,
				}}
			cleaner.Clean(serviceConfig.MaxRetentionTimeInDays)
		},
		time.Now(),
		time.Second*time.Duration(serviceConfig.IntervalInSeconds),
	)

	<-shutdown
	log.Infof("Shutdown signal received")
	jobScheduler.Stop()
	log.Infof("JobScheduler stopped")
	rpcServer.GracefulStop()
	log.Infof("rpc server stopped")
	if httpServer.Shutdown(context.Background()) != nil {
		log.Fatalf("failed to stop http server: %v", err)
	} else {
		log.Infof("http server stopped")
	}
}
