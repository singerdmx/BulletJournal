package main

import (
	"context"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/dao"
	random "github.com/singerdmx/BulletJournal/daemon/utils"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	"github.com/zywangzy/JobScheduler"
	"google.golang.org/grpc"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const (
	requestIDKey = "requestID"
)

var (
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
	log.Printf("Received rpc request for subscribtion: %s", subscribe.String())
	if _, ok := subscriptions[subscribe.Id]; !ok {
		//Add subscription
		subscriptions[subscribe.Id] = stream
		go func() {
			//To do
			//Add business logic here=

			//n := 0
			//for n < 10 {
			//	time.Sleep(3 * time.Second)
			//	if err := stream.Send(&types.StreamMessage{Message: fmt.Sprintf("Hello rpc %s", subscribe.String())}); err != nil {
			//		log.Printf("Unexpected error happened to subscribtion: %s, error: %v", subscribe.String(), err)
			//	} else {
			//		log.Printf("Sent data to subscribtion: %s", subscribe.String())
			//	}
			//	n += 1
			//}
			//delete(subscriptions, subscribe.Id)
		}()
		//Keep the subscription session alive
		for {
			if _, ok := subscriptions[subscribe.Id]; ok {
				time.Sleep(3 * time.Second)
			} else {
				log.Printf("Subscription expires: %s", subscribe.String())
				break
			}
		}
	} else {
		//Skip subscription
		log.Printf("Subscription already exists!")
	}
	return nil
}

func init() {
	config.InitConfig()
	serviceConfig = config.GetConfig()
	subscriptions = map[string]services.Daemon_SubscribeNotificationServer{}
}

func main() {

	ctx := context.Background()
	ctx = context.WithValue(ctx, requestIDKey, random.GenerateUID())
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
		if err := rpcServer.Serve(lis); err != nil {
			log.Fatalf("rpc server failed to serve: %v", err)
		}
	}()

	go func() {
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatalf("http server failed to serve: %v", err)
		}
	}()

	jobScheduler := scheduler.NewJobScheduler()
	jobScheduler.Start()
	jobScheduler.AddRecurrentJob(
		func(...interface{}) {
			dao.Clean(serviceConfig.MaxRetentionTimeInDays)
		},
		time.Now(),
		time.Second*time.Duration(serviceConfig.IntervalInSeconds),
	)

	<-shutdown
	jobScheduler.Stop()
	rpcServer.GracefulStop()
	err = httpServer.Shutdown(context.Background())
	if err != nil {
		log.Fatalf("failed to stop http server: %v", err)
	}
}
