package com.bulletjournal.messaging.mailjet;

import com.mailjet.client.*;
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

    private String senderEmail;

    private String senderName;

    private MailjetClient client;

    private ExecutorService executorService;

    @PostConstruct
    private void initializeMailjetClient() {
        this.executorService = Executors.newSingleThreadExecutor();
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
        List<Future<MailjetResponse>> ret = new ArrayList<>();
        for (MailjetEmailParams params : paramsList) {
            CompletableFuture<MailjetResponse> future = new CompletableFuture<>();
            executorService.submit(() -> {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                MailjetResponse response = sendEmail(getReuqestFromParams(params));
                future.complete(response);
            });
            ret.add(future);
        }
        return ret;
    }

    /**
     * Blocking call to send a single email
     */
    public MailjetResponse sendEmail(MailjetRequest request) {
        if (client == null) {
            LOGGER.error("Mailjet key not set up, skip sending email.");
            return null;
        }
        try {
            MailjetResponse response = client.post(request);
            LOGGER.info("Mail sent, response status: {}, response data: {}",
                response.getStatus(), response.getData());
            return response;
        } catch (MailjetSocketTimeoutException e) {
            LOGGER.error("Email timeout, error:'{}', request:'{}'", e.toString(), request);
        } catch (MailjetException e) {
            LOGGER.error("Got error:'{}' when sending email:'{}'", e.toString(), request);
        }
        return null;
    }

    private MailjetRequest getReuqestFromParams(MailjetEmailParams params) {
        JSONArray receivers = new JSONArray();
        for (Pair<String, String> receiver : params.getReceivers()) {
            receivers.put(new JSONObject().put("Email", receiver.getLeft()));
            receivers.put(new JSONObject().put("Email", receiver.getRight()));
        }
        return new MailjetRequest(Emailv31.resource)
            .property(Emailv31.MESSAGES, new JSONArray()
                .put(new JSONObject()
                    .put(Emailv31.Message.FROM, new JSONObject()
                        .put("Email", this.senderEmail)
                        .put("Name", this.senderName))
                    .put(Emailv31.Message.TO, receivers)
                    .put(Emailv31.Message.SUBJECT, params.getSubject())
                    .put(Emailv31.Message.TEXTPART, params.getText())));
    }
}
