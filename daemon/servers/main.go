package main

import (
	"context"
	"fmt"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	generator "github.com/singerdmx/BulletJournal/daemon/utils"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	"github.com/zywangzy/JobScheduler"
	"google.golang.org/grpc"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const (
	RequestIDKey string = "requestID"
)

var (
	logger logging.Logger
)

// server should implement services.UnimplementedDaemonServer's methods
type server struct {
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
	logger.Printf("Received rpc request for subscribtion: %s", subscribe.String())
	n := 0
	for n < 5 {
		time.Sleep(5 * time.Second)
		if err := stream.Send(&types.StreamMessage{Message: fmt.Sprintf("Hello rpc %s", subscribe.String())}); err != nil {
			return err
		}
		n += 1
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

func main() {

	config.InitConfig()
	serviceConfig := config.GetConfig()

	logging.InitLogging(config.GetEnv())

	ctx := context.Background()
	ctx = AssignRequestID(ctx)
	logger = logging.WithFields(logging.Fields{RequestIDKey: GetRequestID(ctx)})

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	rpcPort := ":" + serviceConfig.RPCPort
	lis, err := net.Listen("tcp", rpcPort)
	if err != nil {
		logger.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, &server{})

	gatewayMux := runtime.NewServeMux()
	endpoint := serviceConfig.Host + rpcPort
	err = services.RegisterDaemonHandlerFromEndpoint(ctx, gatewayMux, endpoint, []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		logger.Fatalf("failed to register rpc server to gateway server: %v", err)
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
		logger.Infof("rpc server running at port [%v]", serviceConfig.RPCPort)
		if err := rpcServer.Serve(lis); err != nil {
			logger.Fatalf("rpc server failed to serve: %v", err)
		}
	}()

	go func() {
		logger.Infof("http server running at port [%v]", serviceConfig.HttpPort)
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := httpServer.ListenAndServe(); err != nil {
			logger.Fatalf("http server failed to serve: %v", err)
		}
	}()

	jobScheduler := scheduler.NewJobScheduler()
	jobScheduler.Start()

	<-shutdown
	jobScheduler.Stop()
	rpcServer.GracefulStop()
	err = httpServer.Shutdown(context.Background())
	if err != nil {
		logger.Fatalf("failed to stop http server: %v", err)
	}
}
