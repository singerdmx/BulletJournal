package com.bulletjournal.clients;

import com.bulletjournal.config.DaemonClientConfig;
import com.bulletjournal.protobuf.daemon.grpc.services.DaemonGrpc;
import com.bulletjournal.protobuf.daemon.grpc.types.StreamMessage;
import com.bulletjournal.protobuf.daemon.grpc.types.SubscribeNotification;
import com.bulletjournal.repository.GoogleCalendarProjectDaoJpa;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DaemonServiceClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(DaemonServiceClient.class);

    private static final String SERVICE_NAME = "Controller";

    @Autowired
    private DaemonClientConfig daemonClientConfig;

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonBlockingStub daemonBlockingStub;

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonStub daemonAsyncStub;

    @Autowired
    private GoogleCalendarProjectDaoJpa googleCalendarProjectDaoJpa;

    @PostConstruct
    public void postConstruct() {
        if (this.daemonClientConfig.isEnabled()) {
            LOGGER.info("We're enabling daemon streaming...");
            subscribeNotification(SubscribeNotification.newBuilder().setServiceName(SERVICE_NAME).build(), newResponseObserver());
        } else {
            LOGGER.info("We don't enable daemon streaming as for now...");
        }
    }

    private void subscribeNotification(SubscribeNotification subscribeNotification, StreamObserver<StreamMessage> responseObserver) {
        LOGGER.info("Start subscribing to daemon server");
        this.daemonAsyncStub.subscribeNotification(subscribeNotification, responseObserver);
    }

    private StreamObserver<StreamMessage> newResponseObserver() {
        return new StreamObserver<StreamMessage>() {
            @Override
            public void onNext(StreamMessage stream) {
                LOGGER.info("Got a daemon streaming message");
                try {
                    switch (stream.getBodyCase()) {
                        case RENEWGOOGLECALENDARWATCHMSG:
                            DaemonServiceClient.this.googleCalendarProjectDaoJpa.renewGoogleCalendarWatch(stream.getRenewGoogleCalendarWatchMsg().getGoogleCalendarProjectId());
                            break;
                        default:
                            LOGGER.warn("No need to handle unsupported service message: {}", stream);
                            break;
                    }
                } catch (Exception e) {
                    LOGGER.error("RenewGoogleCalendarWatch client side error: {}", e);
                }
                LOGGER.info("Processed a daemon streaming message");
            }

            @Override
            public void onError(Throwable t) {
                Status status = Status.fromThrowable(t);
                LOGGER.error("subscribeNotification server side error: {}", status);
                long wait = 10000L;
                LOGGER.info("Will retry subscribing to daemon server again in {}s", wait / 1000);
                try {
                    Thread.sleep(wait);
                    subscribeNotification(SubscribeNotification.newBuilder().setServiceName(SERVICE_NAME).build(), newResponseObserver());
                } catch (InterruptedException interruptedException) {
                    LOGGER.error("Internal error happened before attempting to retry subscribing to daemon server: {}", interruptedException.getMessage());
                    LOGGER.error("Stop subscribing to daemon server due to the previous server side error");
                }
            }

            @Override
            public void onCompleted() {
                LOGGER.info("Stopped receiving subscribeNotification");
            }
        };
    }

}