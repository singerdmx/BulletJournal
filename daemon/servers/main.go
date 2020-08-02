package main

import (
	"context"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/singerdmx/BulletJournal/daemon/protobuf/grpc/services"
	"github.com/singerdmx/BulletJournal/daemon/protobuf/grpc/types"
	"google.golang.org/grpc"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

const (
	local    = "localhost"
	rpcPort  = ":50051"
	httpPort = ":9091"
)

// server is used to implement services.HelloServer
type server struct {
	services.UnimplementedDaemonServer
}

// Send implements the Send rpc endpoint of services.DaemonServer
func (s *server) Send(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	log.Printf("Received rpc request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello rpc"}, nil
}

// RestSend implements the RestSend rest->rpc endpoint of services.DaemonServer
func (s *server) RestSend(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	log.Printf("Received rest request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello rest"}, nil
}

func main() {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	lis, err := net.Listen("tcp", rpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, &server{})

	gatewayMux := runtime.NewServeMux()
	err = services.RegisterDaemonHandlerFromEndpoint(ctx, gatewayMux, local+rpcPort, []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("failed to register rpc server to gateway server: %v", err)
	}
	httpServer := &http.Server{Addr: httpPort, Handler: gatewayMux}

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

	<-shutdown
	rpcServer.GracefulStop()
	err = httpServer.Shutdown(context.Background())
	if err != nil {
		log.Fatalf("failed to stop http server: %v", err)
	}
}
