package com.bulletjournal.messaging.mailjet;

import com.bulletjournal.util.CustomThreadFactory;
import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;
import com.mailjet.client.resource.Emailv31;
import org.apache.commons.lang3.tuple.Pair;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Component
public class MailjetEmailClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(MailjetEmailClient.class);

    private static final String API_KEY_PUBLIC = "MJ_APIKEY_PUBLIC";

    private static final String API_KEY_PRIVATE = "MJ_APIKEY_PRIVATE";

    private static final String API_VERSION = "v3.1";

    private static final String SENDER_EMAIL_VAR = "SENDER_EMAIL";

    private static final String SENDER_NAME_VAR = "SENDER_NAME";

    private static final long AWAIT_TERMINATION_SECONDS = 5;

    private static final int SUCCESS_STATUS = 200;

    private String senderEmail;

    private String senderName;

    private MailjetClient client;

    private ExecutorService executorService;

    public enum Template {
        TASK_DUE_NOTIFICATION(1625167),
        APP_INVITATION(1784938),
        JOIN_GROUP_NOTIFICATION(1768232);

        private final int value;

        Template(int value) {
            this.value = value;
        }

        public int getValue() {
            return this.value;
        }
    }

    @PostConstruct
    private void initializeMailjetClient() {
        this.executorService = Executors.newSingleThreadExecutor(new CustomThreadFactory("EmailClient"));
        if (System.getenv(API_KEY_PUBLIC) != null
            && System.getenv(SENDER_EMAIL_VAR) != null
            && System.getenv(SENDER_NAME_VAR) != null
        ) {
            this.senderEmail = System.getenv(SENDER_EMAIL_VAR);
            this.senderName = System.getenv(SENDER_NAME_VAR);
            try {
                ClientOptions options = new ClientOptions(API_VERSION);
                options.setTimeout(10000);
                this.client = new MailjetClient(
                    System.getenv(API_KEY_PUBLIC),
                    System.getenv(API_KEY_PRIVATE),
                    options
                );
                LOGGER.info("Mailjet client initialized.");
            } catch (Exception e) {
                LOGGER.error("Failed to initialize mailjet client with error:'{}'", e.toString());
            }
        } else {
            LOGGER.error("Mailjet key/senderEmail not set, failed to initialize MailjetClient.");
        }
    }


    public List<Future<MailjetResponse>> sendAllEmailAsync(List<MailjetEmailParams> paramsList) {
        if (client == null) {
            LOGGER.error("Mailjet key not set up, skip sending email.");
            return null;
        }
        List<Future<MailjetResponse>> ret = new ArrayList<>();
        if (paramsList == null || paramsList.isEmpty()) {
            return ret;
        }
        LOGGER.info("Sending emails: {}", paramsList);
        for (MailjetEmailParams params : paramsList) {
            CompletableFuture<MailjetResponse> future = new CompletableFuture<>();
            executorService.submit(() -> {
                try {
                    MailjetResponse response = sendEmail(getReuqestFromParams(params));
                    if (response.getStatus() != SUCCESS_STATUS) {
                        LOGGER.error("Failed to send email, code:'{}', response:'{}'",
                            response.getStatus(), response.getData());
                    }
                    future.complete(response);
                } catch (Exception e) {
                    e.printStackTrace();
                    future.completeExceptionally(e);
                }
            });
            ret.add(future);
        }
        return ret;
    }

    /**
     * Blocking call to send a single email
     */
    public MailjetResponse sendEmail(MailjetRequest request) throws MailjetSocketTimeoutException, MailjetException {
        MailjetResponse response = client.post(request);
        LOGGER.debug("Mail sent, response status: {}, response data: {}",
            response.getStatus(), response.getData());
        return response;
    }

    private MailjetRequest getReuqestFromParams(MailjetEmailParams params) {
        JSONArray receivers = new JSONArray();
        for (Pair<String, String> receiver : params.getReceivers()) {
            receivers.put(
                new JSONObject()
                    .put("name", receiver.getLeft())
                    .put("email", receiver.getRight())
            );
        }
        JSONObject properties = new JSONObject()
                    .put(Emailv31.Message.FROM, new JSONObject()
                        .put("Email", this.senderEmail)
                        .put("Name", this.senderName))
                    .put(Emailv31.Message.TO, receivers)
                    .put(Emailv31.Message.SUBJECT, params.getSubject());
        if (params.getText() != null) {
            properties.put(Emailv31.Message.TEXTPART, params.getText());
        }
        if (params.getTemplate() != null) {
            properties.put(Emailv31.Message.TEMPLATEID, params.getTemplate().getValue());
            properties.put(Emailv31.Message.TEMPLATELANGUAGE, true);
            JSONObject variables = new JSONObject();
            for (Pair<String, Object> pair : params.getKv()) {
                variables.put(pair.getKey(), pair.getValue());
            }
            properties.put(Emailv31.Message.VARIABLES, variables);
        }
        LOGGER.info("email properties: {}", properties);
        MailjetRequest request = new MailjetRequest(Emailv31.resource)
            .property(Emailv31.MESSAGES, new JSONArray().put(properties));
        return request;
    }

    @PreDestroy
    public void preDestroy() {
        if (executorService != null) {
            try {
                executorService.awaitTermination(AWAIT_TERMINATION_SECONDS, TimeUnit.SECONDS);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
