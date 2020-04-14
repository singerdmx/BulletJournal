package com.bulletjournal.controller;

import com.bulletjournal.clients.GoogleCalClient;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.GoogleCalConfig;
import com.bulletjournal.controller.models.LoginStatus;
import com.bulletjournal.controller.models.PullCalendarEventsParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;

@RestController
public class GoogleCalendarController {

    private static final Logger LOGGER = LoggerFactory.getLogger(GoogleCalendarController.class);

    @Autowired
    private GoogleCalConfig googleCalConfig;

    @Autowired
    private GoogleCalClient googleCalClient;

    @PostMapping(value = "/api/calendar/google/login")
    public ResponseEntity<?> loginGoogleCalendar() {
        LOGGER.info("Logging in for Google Calendar");
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setLocation(URI.create(authorize()));
        return ResponseEntity.ok().headers(responseHeader).build();
    }

    @RequestMapping(value = "/api/calendar/google/oauth2_basic/callback", method = RequestMethod.GET, params = "code")
    public RedirectView oauth2Callback(@RequestParam(value = "code") String code) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        try {
            TokenResponse response = this.googleCalClient.getFlow().newTokenRequest(code)
                    .setRedirectUri(this.googleCalConfig.getRedirectURI()).execute();
            this.googleCalClient.getFlow().createAndStoreCredential(response, username);
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }

        return new RedirectView("/settings#google");
    }

    @GetMapping("/api/calendar/google/loginStatus")
    public LoginStatus getLoginStatus() throws IOException {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Credential credential = this.googleCalClient.getFlow().loadCredential(username);
        if (credential == null) {
            return new LoginStatus(false, null);
        }

        return new LoginStatus(true, credential.getExpirationTimeMilliseconds());
    }

    @PostMapping("/api/calendar/google/pullEvents")
    public void pullEvents(@Valid @RequestBody PullCalendarEventsParams pullCalendarEventsParams) throws IOException {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Credential credential = this.googleCalClient.getFlow().loadCredential(username);
        if (credential == null) {
            throw new BadRequestException("User not logged in");
        }
//        com.google.api.services.calendar.model.Events eventList;
//
//        Credential.Builder credential = new Credential.Builder();
//            Calendar client = new com.google.api.services.calendar.Calendar.Builder(
//                    this.googleCalClient.getHttpTransport(), JSON_FACTORY, credential)
//                    .setApplicationName(APPLICATION_NAME).build();
//            Calendar.Events events = client.events();
//            eventList = events.list("primary").setTimeMin(date1).setTimeMax(date2).execute();
//            String message = eventList.getItems().toString();
//            System.out.println("My:" + eventList.getItems());
//
//        System.out.println("cal message:" + message);
    }

    private String authorize() {
        if (this.googleCalClient.getFlow() == null) {
            throw new IllegalStateException("Google Calendar Settings missing");
        }
        AuthorizationCodeRequestUrl authorizationUrl;
        authorizationUrl = this.googleCalClient.getFlow().newAuthorizationUrl()
                .setRedirectUri(this.googleCalConfig.getRedirectURI());
        LOGGER.info("authorizationUrl: " + authorizationUrl);
        return authorizationUrl.build();
    }
}
