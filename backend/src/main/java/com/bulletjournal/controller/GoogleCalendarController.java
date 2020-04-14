package com.bulletjournal.controller;

import com.bulletjournal.clients.GoogleCalClient;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.GoogleCalConfig;
import com.bulletjournal.controller.models.LoginStatus;
import com.bulletjournal.controller.models.PullCalendarEventsParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.repository.CalendarTokenDaoJpa;
import com.bulletjournal.repository.models.CalendarToken;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.Valid;
import java.net.URI;
import java.util.Date;

@RestController
public class GoogleCalendarController {

    private static final Logger LOGGER = LoggerFactory.getLogger(GoogleCalendarController.class);
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "Bullet Journal";

    final DateTime date1 = new DateTime("2017-05-05T16:30:00.000+05:30");
    final DateTime date2 = new DateTime(new Date());

    @Autowired
    private GoogleCalConfig googleCalConfig;

    @Autowired
    private GoogleCalClient googleCalClient;

    @Autowired
    private CalendarTokenDaoJpa calendarTokenDaoJpa;

    @PostMapping(value = "/api/calendar/google/login")
    public ResponseEntity<?> loginGoogleCalendar() {
        LOGGER.info("Logging in for Google Calendar");
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setLocation(URI.create(authorize()));
        return ResponseEntity.ok().headers(responseHeader).build();
    }

    @RequestMapping(value = "/api/calendar/google/oauth2_basic/callback", method = RequestMethod.GET, params = "code")
    public RedirectView oauth2Callback(@RequestParam(value = "code") String code) {

        Credential credential;
        try {
            TokenResponse response = this.googleCalClient.getFlow().newTokenRequest(code)
                    .setRedirectUri(this.googleCalConfig.getRedirectURI()).execute();
            credential = this.googleCalClient.getFlow().createAndStoreCredential(response, "userID");
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.calendarTokenDaoJpa.merge(credential, username);
        return new RedirectView("/settings#google");
    }

    @GetMapping("/api/calendar/google/loginStatus")
    public LoginStatus getLoginStatus() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        CalendarToken calendarToken = this.calendarTokenDaoJpa.get(username);
        if (calendarToken == null) {
            return new LoginStatus(false, null);
        }

        return new LoginStatus(true, calendarToken.getGoogleTokenExpirationTime().getTime());
    }

    @PostMapping("/api/calendar/google/pullEvents")
    public void pullEvents(@Valid @RequestBody PullCalendarEventsParams pullCalendarEventsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        CalendarToken calendarToken = this.calendarTokenDaoJpa.get(username);
        if (calendarToken == null) {
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
