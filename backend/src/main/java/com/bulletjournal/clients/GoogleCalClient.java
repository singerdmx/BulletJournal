package com.bulletjournal.clients;

import com.bulletjournal.config.GoogleCalConfig;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.repository.GoogleCredentialRepository;
import com.bulletjournal.repository.utils.GoogleCalendarDataStoreFactory;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.StoredCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.DataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.common.collect.ImmutableList;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.security.GeneralSecurityException;

@Component
public class GoogleCalClient {

    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "Bullet Journal";

    private GoogleAuthorizationCodeFlow flow;

    private HttpTransport httpTransport;

    @Autowired
    private GoogleCalConfig googleCalConfig;

    @Autowired
    private GoogleCredentialRepository repository;

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
        DataStoreFactory dataStore = new GoogleCalendarDataStoreFactory(this.repository);
        this.flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, JSON_FACTORY, clientSecrets,
                ImmutableList.of(CalendarScopes.CALENDAR_READONLY, CalendarScopes.CALENDAR_EVENTS_READONLY))
                .setAccessType("offline")
                .setApprovalPrompt("force")
                .setDataStoreFactory(dataStore)
                .build();
    }

    public HttpTransport getHttpTransport() {
        return httpTransport;
    }

    public GoogleAuthorizationCodeFlow getFlow() {
        return flow;
    }

    public Calendar getCalendarService() throws IOException {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Credential credential = this.getFlow().loadCredential(username);
        if (credential == null) {
            throw new BadRequestException("User not logged in");
        }

        if (credential.getExpiresInSeconds() <= 0) {
            credential.refreshToken();
            StoredCredential storedCredential = new StoredCredential(credential);
            this.getFlow().getCredentialDataStore().set(username, storedCredential);
        }

        // Initialize Calendar service with valid OAuth credentials
        return new Calendar.Builder(
                this.getHttpTransport(), JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME).build();
    }

}
