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
	services.UnimplementedHelloServer
}

// SayHello implements services.HelloServer
func (s *server) SayHello(ctx context.Context, request *types.HelloRequest) (*types.HelloReply, error) {
	log.Printf("Received: %v", request.GetName())
	return &types.HelloReply{Name: "Hello" + request.GetName()}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterHelloServer(rpcServer, &server{})
	if err := rpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

