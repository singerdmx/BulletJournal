package com.bulletjournal.firebase;

import com.bulletjournal.repository.DeviceTokenDaoJpa;
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
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_BEAN_NAME;

@Service
public class FcmService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FcmService.class);

    private static final String FCM_ACCOUNT_KEY = "FCM_ACCOUNT_KEY";

    private static final String TOKEN_REGISTRATION_ERROR = "registration-token-not-registered";

    @Autowired
    private DeviceTokenDaoJpa deviceTokenDaoJpa;

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

    public void sendAllMessages(List<FcmMessageParams> paramsList) {
        List<Message> messages
            = paramsList.stream().map(this::getMessageFromParams).collect(Collectors.toList());
        ApiFuture<BatchResponse> future
            = FirebaseMessaging.getInstance().sendAllAsync(messages);
        ApiFutures.addCallback(future, new ApiFutureCallback<BatchResponse>() {
            @Override
            public void onFailure(Throwable t) {
                LOGGER.warn("Failed to send messages: {}\nError: {}",
                    paramsList, t.getMessage());
            }

            @Override
            public void onSuccess(BatchResponse result) {
                processResponse(result, paramsList);
            }
        }, executor);
    }

    private void processResponse(BatchResponse batchResponse, List<FcmMessageParams> messages) {
        LOGGER.debug("Got batchResponse, succeeded: {}, failed: {}",
            batchResponse.getSuccessCount(), batchResponse.getFailureCount());
        List<SendResponse> responses = batchResponse.getResponses();
        for (int i = 0; i < responses.size(); ++i) {
            SendResponse response = responses.get(i);
            if (!response.isSuccessful()) {
                LOGGER.warn("Message {} failed to send, error: {}",
                    messages.get(i), response.getException().getErrorCode());
                if (response.getException().getErrorCode().equals(TOKEN_REGISTRATION_ERROR)) {
                    String invalidToken = messages.get(i).getToken();
                    if (deviceTokenDaoJpa.deleteToken(invalidToken)) {
                        LOGGER.info("Removed expired/invalid token {}.", invalidToken);
                    } else {
                        LOGGER.error("Expired/invalid token {} doesn't exist in db.", invalidToken);
                    }
                }
            }
        }
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
