package main

import (
	"context"
	"github.com/singerdmx/BulletJournal/daemon/protobuf/grpc/services"
	"github.com/singerdmx/BulletJournal/daemon/protobuf/grpc/types"
	"google.golang.org/grpc"
	"log"
	"net"
)

const (
	port = ":50051"
)

// server is used to implement services.HelloServer
type server struct {
	services.UnimplementedDaemonServer
}

// Send implements the Send endpoint of services.DaemonServer
func (s *server) Send(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	log.Printf("Received: %v", request.String())
	return &types.ReplyMessage{Message: "Hello"}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, &server{})
	if err := rpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

