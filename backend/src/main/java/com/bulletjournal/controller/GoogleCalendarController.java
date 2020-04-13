package com.bulletjournal.controller;

import com.bulletjournal.clients.GoogleCalClient;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.GoogleCalConfig;
import com.bulletjournal.repository.CalendarTokenDaoJpa;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
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

    @RequestMapping(value = "/api/calendar/google/login", method = RequestMethod.GET)
    public RedirectView googleConnectionStatus(HttpServletRequest request) throws Exception {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        LOGGER.info("Logging in for Google Calendar");
        return new RedirectView(authorize());
    }

    @RequestMapping(value = "/api/calendar/google/oauth2_basic/callback", method = RequestMethod.GET, params = "code")
    public ResponseEntity<String> oauth2Callback(@RequestParam(value = "code") String code) {
        com.google.api.services.calendar.model.Events eventList;
        String message;
        try {
            TokenResponse response = this.googleCalClient.getFlow().newTokenRequest(code)
                    .setRedirectUri(this.googleCalConfig.getRedirectURI()).execute();
            Credential credential = this.googleCalClient.getFlow().createAndStoreCredential(response, "userID");

            String username = MDC.get(UserClient.USER_NAME_KEY);
            calendarTokenDaoJpa.merge(credential, username);

            Calendar client = new com.google.api.services.calendar.Calendar.Builder(
                    this.googleCalClient.getHttpTransport(), JSON_FACTORY, credential)
                    .setApplicationName(APPLICATION_NAME).build();
            Calendar.Events events = client.events();
            eventList = events.list("primary").setTimeMin(date1).setTimeMax(date2).execute();
            message = eventList.getItems().toString();
            System.out.println("My:" + eventList.getItems());
        } catch (Exception e) {
            LOGGER.warn("Exception while handling OAuth2 callback (" + e.getMessage() + ")."
                    + " Redirecting to google connection status page.");
            message = "Exception while handling OAuth2 callback (" + e.getMessage() + ")."
                    + " Redirecting to google connection status page.";
        }

        System.out.println("cal message:" + message);
        return new ResponseEntity<>(message, HttpStatus.OK);
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
