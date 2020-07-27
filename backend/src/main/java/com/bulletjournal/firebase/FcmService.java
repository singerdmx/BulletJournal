package com.bulletjournal.firebase;

import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
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
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_BEAN_NAME;

@Service
public class FcmService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FcmService.class);

    private static final String FCM_ACCOUNT_KEY = "FCM_ACCOUNT_KEY";

    private static final String TOKEN_REGISTRATION_ERROR = "registration-token-not-registered";

    private static final Notification DEFAULT_NOTIFICATION
        = Notification.builder().setTitle("Bullet Journal").setBody("You've got a new message.").build();

    @Autowired
    private DeviceTokenDaoJpa deviceTokenDaoJpa;

    @Autowired
    @Qualifier(APPLICATION_TASK_EXECUTOR_BEAN_NAME)
    private TaskExecutor executor;

    private FirebaseMessaging firebase;

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
                    this.firebase = FirebaseMessaging.getInstance();
                    LOGGER.info("Firebase application has been initialized");
                }
            } catch (IOException e) {
                LOGGER.error("Unable to open FCM private key json file {}", e.toString());
            }
        } else {
            LOGGER.warn("FCM account key not set up, failed to initialize FcmService.");
        }
    }

    public void sendNotificationToUsers(Collection<String> usernames) {
        LOGGER.info("Sending notification to users: {}", usernames);
        Set<DeviceToken> deviceTokens = deviceTokenDaoJpa.getTokensByUsers(usernames);
        List<FcmMessageParams> params = deviceTokens.stream()
            .map(token -> new FcmMessageParams(token.getToken(), "type", "Notification"))
            .collect(Collectors.toList());
        sendAllMessages(params);
    }

    public void sendAllMessages(List<FcmMessageParams> paramsList) {
        if (this.firebase == null) {
            LOGGER.error("FirebaseMessaging not initialized, cannot send message.");
            return;
        }
        List<Message> messages
            = paramsList.stream().map(this::getMessageFromParams).collect(Collectors.toList());
        ApiFuture<BatchResponse> future
            = firebase.sendAllAsync(messages);
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
                LOGGER.warn("Failed to send Message with Error: '{}', message content: '{}'",
                    response.getException().getErrorCode(), messages.get(i));
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
        Message.Builder msg = Message.builder()
            .setToken(fcmMessageParams.getToken())
            .putAllData(fcmMessageParams.getData());
        if (fcmMessageParams.getNotificationTitle() == null) {
            msg.setNotification(DEFAULT_NOTIFICATION);
        } else {
            msg.setNotification(
                Notification.builder()
                    .setTitle(fcmMessageParams.getNotificationTitle())
                    .setBody(fcmMessageParams.getNotificationBody())
                    .build()
            );
        }
        return msg.build();
    }
}
