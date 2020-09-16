package com.bulletjournal.clients;

import com.bulletjournal.config.DaemonClientConfig;
import com.bulletjournal.protobuf.daemon.grpc.services.DaemonGrpc;
import com.bulletjournal.protobuf.daemon.grpc.types.JoinGroupEvents;
import com.bulletjournal.protobuf.daemon.grpc.types.ReplyMessage;
import com.bulletjournal.protobuf.daemon.grpc.types.StreamMessage;
import com.bulletjournal.protobuf.daemon.grpc.types.SubscribeNotification;
import com.bulletjournal.repository.GoogleCalendarProjectDaoJpa;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
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

    private static final String CLIENT_ID = "bulletJournal";

    private static final String CLEANER_SERVICE_NAME = "cleaner";

    private static final String REMINDER_SERVICE_NAME = "reminder";

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
            subscribeNotification(SubscribeNotification.newBuilder().setId(CLIENT_ID).build(), newResponseObserver());
        } else {
            LOGGER.info("We don't enable daemon streaming as for now...");
        }
    }

    public void sendEmail(JoinGroupEvents joinGroupEvents) {
        if (!this.daemonClientConfig.isEnabled()) {
            LOGGER.info("Daemon Service not enabled: skip sending email");
            return;
        }
        try {
            ReplyMessage replyMessage = this.daemonBlockingStub.joinGroupEvents(joinGroupEvents);
            LOGGER.info("joinGroupEvents reply: {}", replyMessage.getMessage());
        } catch (final StatusRuntimeException e) {
            LOGGER.error("joinGroupEvents sent and failed with " + e.getStatus().getCode().name(), e);
            return;
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
                    switch (stream.getId()) {
                        case CLEANER_SERVICE_NAME:
                            DaemonServiceClient.this.googleCalendarProjectDaoJpa.renewGoogleCalendarWatch(stream.getMessage());
                            break;
                        case REMINDER_SERVICE_NAME:
                            // TODO: implement reminder handler
                            LOGGER.info("Reminder service message is not handled: {}", stream);
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
                LOGGER.error("RenewGoogleCalendarWatch server side error: {}", status);
                long wait = 10000L;
                LOGGER.info("Will retry subscribing to daemon server again in {}s", wait / 1000);
                try {
                    Thread.sleep(wait);
                    subscribeNotification(SubscribeNotification.newBuilder().setId(CLIENT_ID).build(), newResponseObserver());
                } catch (InterruptedException interruptedException) {
                    LOGGER.error("Internal error happened before attempting to retry subscribing to daemon server: {}", interruptedException.getMessage());
                    LOGGER.error("Stop subscribing to daemon server due to the previous server side error");
                }
            }

            @Override
            public void onCompleted() {
                LOGGER.info("Stopped receiving GoogleCalendarProjectId");
            }
        };
    }

}