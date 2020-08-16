package main

import (
	"context"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
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
	client := services.NewDaemonClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	//_, err := client.SubscribeNotification(ctx,&types.SubscribeNotification)
	r, err := client.Rest(ctx, &types.JoinGroupEvents{JoinGroupEvents: []*types.JoinGroupEvent{{Events: []*types.Event{}, Originator: "1"},{Events: []*types.Event{}, Originator: "2"}}})
	if err != nil {
		log.Fatalf("Could not send JoinGroupEvents: %v", err)
	}
	log.Printf("Sent JoinGroupEvents with a response: %s", r.Message)
	//for {
	//	message, err := stream.Recv()
	//	if err == io.EOF {
	//		break
	//	}
	//	if err != nil {
	//		log.Fatalf("%v.JoinGroupEvents(_) = _, %v", client, err)
	//	}
	//	log.Println(message)
	//}
	//log.Printf("Received all JoinGroupEvents responses")
}
