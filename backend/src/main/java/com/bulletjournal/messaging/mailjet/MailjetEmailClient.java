package com.bulletjournal.messaging.mailjet;

import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@Component
public class MailjetEmailClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(MailjetEmailClient.class);

    private static final String API_KEY_PUBLIC = "MJ_APIKEY_PUBLIC";

    private static final String API_KEY_PRIVATE = "MJ_APIKEY_PRIVATE";

    private static final String API_VERSION = "v3.1";

    private MailjetClient client;

    private Executor executor;

    @PostConstruct
    private void initializeMailjetClient() {
        if (System.getenv(API_KEY_PUBLIC) != null) {
            try {
                ClientOptions options = new ClientOptions(API_VERSION);
                options.setTimeout(10000);
                this.client = new MailjetClient(
                    System.getenv(API_KEY_PUBLIC),
                    System.getenv(API_KEY_PRIVATE),
                    options
                );
                this.executor = Executors.newSingleThreadExecutor();
            } catch (Exception e) {
                LOGGER.error("Failed to initialize mailjet client with error:'{}'", e.toString());
            }
        } else {
            LOGGER.error("Mailjet key not set up, failed to initialize MailjetClient.");
        }
    }

    public MailjetResponse sendEmail(MailjetRequest request)
        throws MailjetSocketTimeoutException, MailjetException {
        if (client == null) {
            LOGGER.warn("Mailjet key not set up, skip sending email.");
            return null;
        }
        MailjetResponse response = client.post(request);
        LOGGER.info("Mail sent, response status: {}, response data: {}",
            response.getStatus(), response.getData());
        return response;
    }
}
