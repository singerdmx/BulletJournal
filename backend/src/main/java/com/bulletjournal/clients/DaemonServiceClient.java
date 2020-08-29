package com.bulletjournal.clients;

import com.bulletjournal.protobuf.daemon.grpc.services.DaemonGrpc;
import com.bulletjournal.protobuf.daemon.grpc.types.JoinGroupEvents;
import com.bulletjournal.protobuf.daemon.grpc.types.ReplyMessage;
import com.bulletjournal.protobuf.daemon.grpc.types.StreamMessage;
import com.bulletjournal.protobuf.daemon.grpc.types.SubscribeNotification;
import io.grpc.StatusRuntimeException;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class DaemonServiceClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(DaemonServiceClient.class);

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonBlockingStub daemonBlockingStub;

    public String sendEmail(JoinGroupEvents joinGroupEvents) {
        try {
            ReplyMessage replyMessage = this.daemonBlockingStub.joinGroupEvents(joinGroupEvents);
            return replyMessage.getMessage();
        } catch (final StatusRuntimeException e) {
            LOGGER.error("Failed with " + e.getStatus().getCode().name());
            return null;
        }
    }

    public Iterator<StreamMessage> subscribeNotification(SubscribeNotification subscribeNotification) {
        try {
            return this.daemonBlockingStub.subscribeNotification(subscribeNotification);
        } catch (final StatusRuntimeException e) {
            LOGGER.error("Failed with " + e.getStatus().getCode().name());
            return null;
        }
    }

}
