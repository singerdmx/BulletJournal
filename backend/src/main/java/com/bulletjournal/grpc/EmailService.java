package com.bulletjournal.grpc;

import com.bulletjournal.protobuf.daemon.grpc.services.DaemonGrpc;

import com.bulletjournal.protobuf.daemon.grpc.types.JoinGroupEvents;
import com.bulletjournal.protobuf.daemon.grpc.types.ReplyMessage;
import io.grpc.StatusRuntimeException;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @GrpcClient("localhost")
    private DaemonGrpc.DaemonBlockingStub daemonBlockingStub;

    public String sendEmail(JoinGroupEvents joinGroupEvents) {
        try {
            ReplyMessage replyMessage = this.daemonBlockingStub.joinGroupEvents(joinGroupEvents);
            return replyMessage.getMessage();
        } catch (final StatusRuntimeException e) {
            return "Failed with " + e.getStatus().getCode().name();
        }
    }

}
