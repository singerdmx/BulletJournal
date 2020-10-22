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
	"github.com/singerdmx/BulletJournal/daemon/api/middleware"
	daemon "github.com/singerdmx/BulletJournal/daemon/api/service"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	scheduler "github.com/zywangzy/JobScheduler"
	"google.golang.org/grpc"
	"upper.io/db.v3/postgresql"
)

const (
	bulletJournalId       string = "Controller"
	fanInServiceName      string = "fanIn"
	cleanerServiceName    string = "cleaner"
	reminderServiceName   string = "reminder"
	investmentServiceName string = "investment"
)

var log logging.Logger

// server should implement services.UnimplementedDaemonServer's methods
type server struct {
	serviceConfig *config.Config
	subscriptions map[string][]daemon.Streaming
}

// HealthCheck implements the rest endpoint healthcheck -> rpc
func (s *server) HealthCheck(
	ctx context.Context, request *types.HealthCheckRequest) (*types.HealthCheckResponse, error) {
	// log.Printf("Received health check request: %v", request.String())
	return &types.HealthCheckResponse{}, nil
}

func (s *server) SubscribeNotification(
	subscribe *types.SubscribeNotificationMsg, stream services.Daemon_SubscribeNotificationServer) error {
	log.Printf("Received rpc request for subscription: %s", subscribe.String())
	if _, ok := s.subscriptions[subscribe.ServiceName]; ok {
		log.Printf("Subscription: %s's streaming has been idle, start streaming!", subscribe.String())
		daemonServices := s.subscriptions[subscribe.ServiceName]
		// Prevent requests with the same subscribe.Id from new subscriptions
		delete(s.subscriptions, subscribe.ServiceName)
		// Keep the subscription session alive
		var fanInChannel chan *daemon.StreamingMessage
		for _, service := range daemonServices {
			if service.ServiceName == fanInServiceName {
				fanInChannel = service.ServiceChannel
			} else {
				go func(service daemon.Streaming) {
					for message := range service.ServiceChannel {
						message.ServiceName = service.ServiceName
						log.Printf("Preparing streaming: %v to subscription: %s", message, subscribe.String())
						fanInChannel <- message
					}
				}(service)
			}
		}
		for serviceMsg := range fanInChannel {
			if serviceMsg == nil {
				log.Printf("ServiceStreaming: %s for subscription: %s is closed",
					serviceMsg.ServiceName, subscribe.String())
				log.Printf("Closing streaming to subscription: %s", subscribe.String())
				break
			} else if serviceMsg.ServiceName == cleanerServiceName {
				projectId := strconv.Itoa(int(serviceMsg.Message))
				if err := stream.Send(
					&types.NotificationStreamMsg{
						Body: &types.NotificationStreamMsg_RenewGoogleCalendarWatchMsg{
							RenewGoogleCalendarWatchMsg:
								&types.SubscribeRenewGoogleCalendarWatchMsg{GoogleCalendarProjectId: projectId}}},
				); err != nil {
					log.Printf("Unexpected error happened to subscription: %s, error: %v", subscribe.String(), err)
					// Allow future requests with the same subscribe.ServiceName from new subscriptions
					s.subscriptions[subscribe.ServiceName] = daemonServices
					log.Printf("Transition streaming to idle for subscription: %s", subscribe.String())
					break
				} else {
					log.Printf("Streaming projectId: %s to subscription: %s", projectId, subscribe.String())
				}
			} else if serviceMsg.ServiceName == investmentServiceName {
				sampleTaskId := serviceMsg.Message
				if err := stream.Send(
					&types.NotificationStreamMsg{
						Body: &types.NotificationStreamMsg_SampleTaskMsg{
							SampleTaskMsg: &types.SubscribeSampleTaskMsg{SampleTaskId: sampleTaskId}}},
				); err != nil {
					log.Printf("Unexpected error happened to subscription: %s, error: %v", subscribe.String(), err)
					// Allow future requests with the same subscribe.ServiceName from new subscriptions
					s.subscriptions[subscribe.ServiceName] = daemonServices
					log.Printf("Transition streaming to idle for subscription: %s", subscribe.String())
					break
				}
			} else {
				log.Printf("ServiceStreaming: %s for subscription: %s is not implemented as for now",
					serviceMsg.ServiceName, subscribe.String())
			}
		}
	} else {
		log.Printf("Subscription %s is already streaming!", subscribe.String())
	}
	return nil
}

func main() {
	logging.InitLogging(config.GetEnv())
	log = *logging.GetLogger()

	ctx := context.Background()
	log.WithContext(ctx)

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	fanInServiceStreaming := daemon.Streaming{ServiceName: fanInServiceName, ServiceChannel: make(chan *daemon.StreamingMessage, 100)}
	cleanerServiceStreaming := daemon.Streaming{ServiceName: cleanerServiceName, ServiceChannel: make(chan *daemon.StreamingMessage, 100)}
	reminderServiceStreaming := daemon.Streaming{ServiceName: reminderServiceName, ServiceChannel: make(chan *daemon.StreamingMessage, 100)}
	investmentServiceStreaming := daemon.Streaming{ServiceName: investmentServiceName, ServiceChannel: make(chan *daemon.StreamingMessage, 100)};
	daemonRpc := &server{
		serviceConfig: config.GetConfig(),
		subscriptions: map[string][]daemon.Streaming{
			bulletJournalId:
				{fanInServiceStreaming, cleanerServiceStreaming, reminderServiceStreaming, investmentServiceStreaming}},
	}

	rpcPort := ":" + daemonRpc.serviceConfig.RPCPort
	lis, err := net.Listen("tcp", rpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, daemonRpc)

	gatewayMux := runtime.NewServeMux(
		runtime.WithIncomingHeaderMatcher(
			middleware.IncomingHeaderMatcher), runtime.WithOutgoingHeaderMatcher(middleware.OutgoingHeaderMatcher))
	endpoint := "127.0.0.1" + rpcPort
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
	cleaner := daemon.Cleaner{
		ServiceStreaming: cleanerServiceStreaming,
		Settings: postgresql.ConnectionURL{
			Host:     daemonRpc.serviceConfig.Host + ":" + daemonRpc.serviceConfig.DBPort,
			Database: daemonRpc.serviceConfig.Database,
			User:     daemonRpc.serviceConfig.Username,
			Password: daemonRpc.serviceConfig.Password,
		},
	}

	PST, _ := time.LoadLocation("America/Los_Angeles")
	log.Infof("PST [%T] [%v]", PST, PST)

	year, month, day := time.Now().AddDate(0, 0, daemonRpc.serviceConfig.IntervalInDays).In(PST).Date()
	start := time.Date(year, month, day, 0, 0, 0, 0, PST)

	daemonBackgroundJob := daemon.Job{
		Cleaner: cleaner, Reminder: daemon.Reminder{},
		Investment: daemon.Investment{ServiceStreaming: investmentServiceStreaming},
	}
	log.Infof("The next daemon job will start at %v", start.Format(time.RFC3339))
	log.Infof("And Now it's %v", time.Now().Format(time.RFC3339))

	var interval time.Duration
	interval = time.Hour * 24 * time.Duration(daemonRpc.serviceConfig.IntervalInDays)

	// use a separate go routine to avoid blocking main thread
	go func() {
		daemonBackgroundJob.Run(PST, daemonRpc.serviceConfig.MaxRetentionTimeInDays)
	}()

	jobScheduler.AddRecurrentJob(
		daemonBackgroundJob.Run,
		start,
		interval,
		PST,
		daemonRpc.serviceConfig.MaxRetentionTimeInDays,
	)

	<-shutdown
	log.Infof("Shutdown signal received")
	cleaner.Close()
	close(reminderServiceStreaming.ServiceChannel)
	close(fanInServiceStreaming.ServiceChannel)
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
