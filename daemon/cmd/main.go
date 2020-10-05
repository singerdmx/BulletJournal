package main

import (
	"context"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/singerdmx/BulletJournal/daemon/api/middleware"
	daemon "github.com/singerdmx/BulletJournal/daemon/api/service"
	"github.com/singerdmx/BulletJournal/daemon/cmd/server"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	scheduler "github.com/zywangzy/JobScheduler"
	"google.golang.org/grpc"
	"upper.io/db.v3/postgresql"
)

var log logging.Logger

func main() {
	logging.InitLogging(config.GetEnv())
	log = *logging.GetLogger()

	ctx := context.Background()
	log.WithContext(ctx)

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	fanInService := daemon.Streaming{ServiceName: server.FanInServiceName, ServiceChannel: make(chan *daemon.StreamingMessage, 100)}
	cleanerService := daemon.Streaming{ServiceName: server.CleanerServiceName, ServiceChannel: make(chan *daemon.StreamingMessage, 100)}
	reminderService := daemon.Streaming{ServiceName: server.ReminderServiceName, ServiceChannel: make(chan *daemon.StreamingMessage, 100)}
	daemonRpc := server.NewServer(ctx, []daemon.Streaming{fanInService, cleanerService, reminderService})

	rpcPort := ":" + daemonRpc.ServiceConfig.RPCPort
	lis, err := net.Listen("tcp", rpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	rpcServer := grpc.NewServer()
	services.RegisterDaemonServer(rpcServer, daemonRpc)

	gatewayMux := runtime.NewServeMux(runtime.WithIncomingHeaderMatcher(middleware.IncomingHeaderMatcher), runtime.WithOutgoingHeaderMatcher(middleware.OutgoingHeaderMatcher))
	endpoint := "127.0.0.1" + rpcPort
	err = services.RegisterDaemonHandlerFromEndpoint(ctx, gatewayMux, endpoint, []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("failed to register rpc server to gateway server: %v", err)
	}

	httpAddr := ":" + daemonRpc.ServiceConfig.HttpPort
	httpServer := &http.Server{Addr: httpAddr, Handler: gatewayMux}

	//// Serve the swagger-ui and swagger file
	//mux := http.NewServeMux()
	//mux.Handle("/", rmux)
	//mux.HandleFunc("/swagger.json", serveSwagger)
	//fs := http.FileServer(http.Dir("www/swagger-ui"))
	//mux.Handle("/swagger-ui/", http.StripPrefix("/swagger-ui", fs))

	go func() {
		log.Infof("rpc server running at port [%v]", daemonRpc.ServiceConfig.RPCPort)
		if err := rpcServer.Serve(lis); err != nil {
			log.Fatalf("rpc server failed to serve: %v", err)
		}
	}()

	go func() {
		log.Infof("http server running at port [%v]", daemonRpc.ServiceConfig.HttpPort)
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatalf("http server failed to serve: %v", err)
		}
	}()

	jobScheduler := scheduler.NewJobScheduler()
	jobScheduler.Start()
	cleaner := daemon.Cleaner{
		Service: cleanerService,
		Settings: postgresql.ConnectionURL{
			Host:     daemonRpc.ServiceConfig.Host + ":" + daemonRpc.ServiceConfig.DBPort,
			Database: daemonRpc.ServiceConfig.Database,
			User:     daemonRpc.ServiceConfig.Username,
			Password: daemonRpc.ServiceConfig.Password,
		},
	}

	PST, _ := time.LoadLocation("America/Los_Angeles")
	log.Infof("PST [%T] [%v]", PST, PST)
	year, month, day := time.Now().AddDate(0, 0, daemonRpc.ServiceConfig.IntervalInDays).In(PST).Date()
	start := time.Date(year, month, day, 0, 0, 0, 0, PST)

	daemonBackgroundJob := daemon.Job{Cleaner: cleaner, Reminder: daemon.Reminder{}, Investment: daemon.Investment{}}
	log.Infof("The next daemon job will start at %v", start.Format(time.RFC3339))
	jobScheduler.AddRecurrentJob(
		daemonBackgroundJob.Run,
		start,
		time.Hour*24*time.Duration(daemonRpc.ServiceConfig.IntervalInDays),
		PST,
		daemonRpc.ServiceConfig.MaxRetentionTimeInDays,
	)

	<-shutdown
	log.Infof("Shutdown signal received")
	cleaner.Close()
	close(reminderService.ServiceChannel)
	close(fanInService.ServiceChannel)
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
