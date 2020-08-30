package com.bulletjournal.clients;

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

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonBlockingStub daemonBlockingStub;

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonStub daemonAsyncStub;

    @Autowired
    private GoogleCalendarProjectDaoJpa googleCalendarProjectDaoJpa;

    @PostConstruct
    public void postConstruct() {
        subscribeNotification();
    }

    public String sendEmail(JoinGroupEvents joinGroupEvents) {
        try {
            ReplyMessage replyMessage = this.daemonBlockingStub.joinGroupEvents(joinGroupEvents);
            return replyMessage.getMessage();
        } catch (final StatusRuntimeException e) {
            LOGGER.error("Failed with " + e.getStatus().getCode().name());
            return null;
        }
    }

    private void subscribeNotification() {
        StreamObserver<StreamMessage> responseObserver = new StreamObserver<StreamMessage>() {
            @Override
            public void onNext(StreamMessage stream) {
                LOGGER.info("Got a daemon streaming message");
                try {
                    DaemonServiceClient.this.googleCalendarProjectDaoJpa
                            .renewGoogleCalendarWatch(stream.getMessage());
                } catch (Exception e) {
                    LOGGER.error("renewGoogleCalendarWatch client side error: ", e);
                }
                LOGGER.info("Processed a daemon streaming message");
            }

            @Override
            public void onError(Throwable t) {
                Status status = Status.fromThrowable(t);
                LOGGER.error("renewGoogleCalendarWatch server side error: ", status);
            }

            @Override
            public void onCompleted() {
                LOGGER.info("Stopped receiving GoogleCalendarProjectId");
            }
        };
        subscribeNotification(SubscribeNotification.newBuilder().setId("cleaner").build(), responseObserver);
    }

    private void subscribeNotification(SubscribeNotification subscribeNotification, StreamObserver<StreamMessage> responseObserver) {
        while (true) {
            try {
                LOGGER.info("Start subscribing to daemon server");
                this.daemonAsyncStub.subscribeNotification(subscribeNotification, responseObserver);
                break;
            } catch (final StatusRuntimeException e) {
                LOGGER.error("Failed with " + e.getStatus().getCode().name());
                long wait = 10000L;
                LOGGER.info("Will retry subscribing to daemon server again in {}s", wait / 1000);
                try {
                    Thread.sleep(wait);
                } catch (InterruptedException interruptedException) {
                    LOGGER.info("Internal error happened when subscribing to daemon server: {}", interruptedException.getMessage());
                }
            }
        }
    }

}
