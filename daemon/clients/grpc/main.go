package main

import (
	"context"
	"io"
	"log"
	"os"
	"time"

	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	"google.golang.org/grpc"
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

	id := "A"
	if len(os.Args) > 1 {
		id = os.Args[1]
	}

	stream, err := client.SubscribeNotification(ctx, &types.SubscribeNotification{ServiceName: id})
	//r, err := client.Rest(ctx, &types.JoinGroupEvents{JoinGroupEvents: []*types.JoinGroupEvent{{Events: []*types.Event{}, Originator: "1"},{Events: []*types.Event{}, Originator: "2"}}})
	//if err != nil {
	//	log.Fatalf("Could not send JoinGroupEvents: %v", err)
	//}
	//log.Printf("Sent JoinGroupEvents with a response: %s", r.Message)
	go func() {
		for {
			message, err := stream.Recv()
			if err == io.EOF {
				log.Printf("Subscription: %s expires", id)
				break
			}
			if err != nil {
				log.Fatalf("Server side error happened: %v", err)
			}
			log.Println(message.Body)
		}
		log.Printf("Received all JoinGroupEvents responses")
	}()
	time.Sleep(40 * time.Second)
}
