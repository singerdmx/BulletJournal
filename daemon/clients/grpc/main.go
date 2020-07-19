package main

import (
	"context"
	"github.com/singerdmx/BulletJournal/daemon/protobuf/grpc/services"
	"github.com/singerdmx/BulletJournal/daemon/protobuf/grpc/types"
	"google.golang.org/grpc"
	"log"
	"time"
)

const (
	address = "localhost:50051"
)

func main() {
	// Set up a connection to the server.
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	client := services.NewHelloClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	r, err := client.SayHello(ctx, &types.HelloRequest{Name: "BulletJournal"})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}
	log.Printf("Greeting: %s", r.Name)
}
