package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/singerdmx/BulletJournal/daemon/api/middleware"
	daemon "github.com/singerdmx/BulletJournal/daemon/api/service"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/daemon/rpc_server/subscribe_server"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	scheduler "github.com/zywangzy/JobScheduler"
	"google.golang.org/grpc"
)

var logger logging.Logger

func main() {
	logging.InitLogging(config.GetEnv())
	logger = *logging.GetLogger()
	ctx := context.Background()
	logger.WithContext(ctx)

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT)

	/***********************
	 *  Start RPC server
	 ***********************/
	subscribeRpcServer := subscribe_server.NewServer(ctx)

	configObj := subscribeRpcServer.ServiceConfig

	rpcPort := ":" + configObj.RPCPort
	listener, err := net.Listen("tcp", rpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()
	services.RegisterDaemonServer(grpcServer, subscribeRpcServer)

	gatewayMux := runtime.NewServeMux(
		runtime.WithIncomingHeaderMatcher(
			middleware.IncomingHeaderMatcher), runtime.WithOutgoingHeaderMatcher(middleware.OutgoingHeaderMatcher))
	endpoint := "127.0.0.1" + rpcPort
	err = services.RegisterDaemonHandlerFromEndpoint(ctx, gatewayMux, endpoint, []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("failed to register rpc server to gateway server: %v", err)
	}
	httpAddr := ":" + configObj.HttpPort
	httpServer := &http.Server{Addr: httpAddr, Handler: gatewayMux}

	go func() {
		logger.Infof("rpc server running at port [%v]", configObj.RPCPort)
		if err := grpcServer.Serve(listener); err != nil {
			log.Fatalf("rpc server failed to serve: %v", err)
		}
	}()
	subscribeRpcServer.StartDispatcher()

	go func() {
		logger.Infof("http server running at port [%v]", configObj.HttpPort)
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatalf("http server failed to serve: %v", err)
		}
	}()

	jobScheduler := scheduler.NewJobScheduler()
	jobScheduler.Start()

	PST, _ := time.LoadLocation("America/Los_Angeles")
	logger.Infof("PST [%T] [%v]", PST, PST)

	year, month, day := time.Now().AddDate(0, 0, configObj.IntervalInDays).In(PST).Date()
	start := time.Date(year, month, day, 0, 0, 0, 0, PST)

	daemonBackgroundJob := daemon.Job{
		Cleaner:    subscribeRpcServer.CleanerService,
		Reminder:   subscribeRpcServer.ReminderService,
		Investment: subscribeRpcServer.InvestmentService,
	}
	logger.Infof("The next daemon job will start at %v", start.Format(time.RFC3339))
	logger.Infof("And Now it's %v", time.Now().Format(time.RFC3339))

	var interval time.Duration
	interval = time.Hour * 24 * time.Duration(configObj.IntervalInDays)

	// use a separate go routine to avoid blocking main thread
	go func() {
		daemonBackgroundJob.Run(PST, configObj.MaxRetentionTimeInDays)
	}()

	jobScheduler.AddRecurrentJob(
		daemonBackgroundJob.Run,
		start,
		interval,
		PST,
		configObj.MaxRetentionTimeInDays,
	)

	<-shutdown
	logger.Infof("Shutdown signal received")
	close(subscribeRpcServer.FanInChannel)
	//jobScheduler.Stop()
	logger.Infof("JobScheduler stopped")
	subscribeRpcServer.Stop()
	grpcServer.GracefulStop()
	logger.Infof("rpc server stopped")
	if httpServer.Shutdown(ctx) != nil {
		log.Fatalf("failed to stop http server: %v", err)
	} else {
		logger.Infof("http server stopped")
	}
}
