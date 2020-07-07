package com.bulletjournal.firebase;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_BEAN_NAME;

@Service
public class FcmService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FcmService.class);

    private static final String FCM_ACCOUNT_KEY = "FCM_ACCOUNT_KEY";

    @Autowired
    @Qualifier(APPLICATION_TASK_EXECUTOR_BEAN_NAME)
    private TaskExecutor executor;

    @PostConstruct
    public void initialize() {
        if (System.getenv(FCM_ACCOUNT_KEY) != null) {
            try {
                FirebaseOptions options
                    = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(
                            new FileSystemResource(System.getenv(FCM_ACCOUNT_KEY)).getInputStream()))
                    .build();
                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    LOGGER.info("Firebase application has been initialized");
                }
            } catch (IOException e) {
                LOGGER.error(e.getMessage());
            }
        } else {
            LOGGER.warn("FCM account key not set up, failed to initialize FcmService.");
        }
    }

    public void sendAllMessages(Collection<FcmMessageParams> paramsList) {
        LOGGER.warn("here3:");
        List<Message> messages
            = paramsList.stream().map(this::getMessageFromParams).collect(Collectors.toList());
        ApiFuture<BatchResponse> future
            = FirebaseMessaging.getInstance().sendAllAsync(messages);
        ApiFutures.addCallback(future, new ApiFutureCallback<BatchResponse>() {
            @Override
            public void onFailure(Throwable t) {
                LOGGER.warn("here1" + t.toString());
                // TODO: handle error
            }

            @Override
            public void onSuccess(BatchResponse result) {
                processResponse(result);
            }
        }, executor);
    }

    private void processResponse(BatchResponse batchResponse) {
        // TODO
        batchResponse.getResponses().forEach(r -> {
            LOGGER.warn(r.getMessageId() + " " + r.getException());
        });
        LOGGER.warn("here2:" + batchResponse.toString());
    }

    private Message getMessageFromParams(FcmMessageParams fcmMessageParams) {
        return Message.builder()
            .setNotification(
                Notification.builder()
                    .setTitle(fcmMessageParams.getTitle())
                    .setBody(fcmMessageParams.getMessage()).build())
            .setToken(fcmMessageParams.getToken())
            .setTopic(fcmMessageParams.getTopic())
            .build();
    }
}
