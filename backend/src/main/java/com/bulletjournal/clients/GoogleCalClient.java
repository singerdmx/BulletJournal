package com.bulletjournal.clients;

import com.bulletjournal.config.GoogleCalConfig;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.CalendarScopes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Component
public class GoogleCalClient {

    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();


    private GoogleAuthorizationCodeFlow flow;

    private HttpTransport httpTransport;

    @Autowired
    private GoogleCalConfig googleCalConfig;

    @PostConstruct
    void initializeFlow() throws GeneralSecurityException, IOException {
        if (this.googleCalConfig.getClientId() == null || this.googleCalConfig.getClientSecret() == null) {
            return;
        }

        GoogleClientSecrets.Details web = new GoogleClientSecrets.Details();
        web.setClientId(this.googleCalConfig.getClientId());
        web.setClientSecret(this.googleCalConfig.getClientSecret());
        GoogleClientSecrets clientSecrets = new GoogleClientSecrets().setWeb(web);
        this.httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        this.flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, JSON_FACTORY, clientSecrets,
                Collections.singleton(CalendarScopes.CALENDAR)).build();
    }

    public HttpTransport getHttpTransport() {
        return httpTransport;
    }

    public GoogleAuthorizationCodeFlow getFlow() {
        return flow;
    }

}
