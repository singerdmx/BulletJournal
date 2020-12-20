package com.bulletjournal.clients;

import com.bulletjournal.config.DaemonClientConfig;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.SampleTaskChange;
import com.bulletjournal.protobuf.daemon.grpc.services.DaemonGrpc;
import com.bulletjournal.protobuf.daemon.grpc.types.NotificationStreamMsg;
import com.bulletjournal.protobuf.daemon.grpc.types.SubscribeNotificationMsg;
import com.bulletjournal.protobuf.daemon.grpc.types.SubscribeSampleTaskMsg;
import com.bulletjournal.repository.GoogleCalendarProjectDaoJpa;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DaemonServiceClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(DaemonServiceClient.class);

    private static final String SERVICE_NAME = "Controller";

    private static final String DEFAULT_CLIENT_ID = "DEFAULT_BULLETJOURNAL_CLIENT_ID";

    private static final String CLIENT_ID_KEY = "RPC_CLIENT_ID";

    private static final long RETRY_WAIT = 10000L;

    private String clientId;

    @Autowired
    private DaemonClientConfig daemonClientConfig;

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonBlockingStub daemonBlockingStub;

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonStub daemonAsyncStub;

    @Autowired
    private GoogleCalendarProjectDaoJpa googleCalendarProjectDaoJpa;

    @Lazy
    @Autowired
    private NotificationService notificationService;

    @PostConstruct
    public void postConstruct() {
        this.clientId = System.getenv(CLIENT_ID_KEY);
        if (this.clientId == null) {
            this.clientId = DEFAULT_CLIENT_ID;
        }
        if (this.daemonClientConfig.isEnabled()) {
            LOGGER.info("Enabling daemon streaming, Client ID: {}", clientId);
            subscribeNotification();
        } else {
            LOGGER.info("Daemon streaming is Disabled");
        }
    }

    private void subscribeNotification() {
        LOGGER.info("Sending subscribeNotification to daemon server");
        this.daemonAsyncStub.subscribeNotification(
                SubscribeNotificationMsg.newBuilder().setServiceName(SERVICE_NAME).setClientId(this.clientId).build(),
                newResponseObserver());
    }

    private StreamObserver<NotificationStreamMsg> newResponseObserver() {
        return new StreamObserver<NotificationStreamMsg>() {
            @Override
            public void onNext(NotificationStreamMsg streamMsg) {
                LOGGER.info("Received daemon streaming message: {}", streamMsg);
                try {
                    switch (streamMsg.getBodyCase()) {
                        case RENEWGOOGLECALENDARWATCHMSG:
                            DaemonServiceClient.this.googleCalendarProjectDaoJpa.renewGoogleCalendarWatch(streamMsg.getRenewGoogleCalendarWatchMsg().getGoogleCalendarProjectId());
                            break;
                        case SAMPLETASKMSG:
                            SubscribeSampleTaskMsg msg = streamMsg.getSampleTaskMsg();
                            LOGGER.info("Received SubscribeInvestmentSampleTaskMsg with sampleTaskId: {}", msg.getSampleTaskId());
                            DaemonServiceClient.this.notificationService.addSampleTaskChange(new SampleTaskChange(msg.getSampleTaskId()));
                            break;
                        default:
                            LOGGER.warn("Unsupported NotificationStreamMsg body");
                            break;
                    }
                } catch (Exception e) {
                    LOGGER.error("Subscription client side error: {}", e.toString());
                }
                LOGGER.info("Processed a daemon streaming message");
            }

            @Override
            public void onError(Throwable t) {
                Status status = Status.fromThrowable(t);
                LOGGER.error("subscribeNotification server side error: {}, retry scheduled in {}s", status, RETRY_WAIT / 1000);
                try {
                    Thread.sleep(RETRY_WAIT);
                    subscribeNotification();
                } catch (InterruptedException interruptedException) {
                    LOGGER.error("Internal error happened before attempting to retry subscribing to daemon server", interruptedException);
                    LOGGER.error("Stop subscribing to daemon server due to the previous server side error");
                }
            }

            @Override
            public void onCompleted() {
                LOGGER.info("Stopped receiving subscribeNotification, will retry subscribing to daemon server again in {}s",
                        RETRY_WAIT / 1000);
                try {
                    Thread.sleep(RETRY_WAIT);
                    subscribeNotification();
                } catch (InterruptedException interruptedException) {
                    LOGGER.error("Internal error happened before attempting to retry subscribing to daemon server", interruptedException);
                }
            }
        };
    }

}