package com.bulletjournal.controller;

import com.bulletjournal.calendars.google.Converter;
import com.bulletjournal.calendars.google.CreateGoogleCalendarEventsParams;
import com.bulletjournal.calendars.google.GoogleCalendarEvent;
import com.bulletjournal.clients.GoogleCalClient;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.GoogleCalConfig;
import com.bulletjournal.controller.models.LoginStatus;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.repository.TaskDaoJpa;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarList;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class GoogleCalendarController {

    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final Logger LOGGER = LoggerFactory.getLogger(GoogleCalendarController.class);
    private static final String APPLICATION_NAME = "Bullet Journal";
    private static final String GOOGLE_CALENDAR_PAGE_PATH = "/settings#google";

    @Autowired
    private GoogleCalConfig googleCalConfig;

    @Autowired
    private GoogleCalClient googleCalClient;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private UserClient userClient;

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

        return new RedirectView(GOOGLE_CALENDAR_PAGE_PATH);
    }

    @PostMapping(value = "/api/calendar/google/logout")
    public ResponseEntity<?> logoutGoogleCalendar() throws IOException {
        LOGGER.info("Logging out for Google Calendar");
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.googleCalClient.getFlow().getCredentialDataStore().delete(username);
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setLocation(URI.create(GOOGLE_CALENDAR_PAGE_PATH));
        return ResponseEntity.ok().headers(responseHeader).build();
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

    @GetMapping("/api/calendar/google/calendars/{calendarId}/eventList")
    public List<GoogleCalendarEvent> getEventList(
            @NotNull @PathVariable String calendarId,
            @NotBlank @RequestParam String timezone,
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate) throws IOException {
        Calendar service = getCalendarService();
        Calendar.Events.List list = service.events().list(calendarId);
        if (StringUtils.isNotBlank(startDate)) {
            list.setTimeMin(DateTime.parseRfc3339(startDate));
        }
        if (StringUtils.isNotBlank(endDate)) {
            list.setTimeMax(DateTime.parseRfc3339(endDate));
        }
        List<Event> events = list.execute().getItems();
        return events.stream()
                .map(e -> {
                    GoogleCalendarEvent event = Converter.toTask(e, timezone);
                    Task task = event.getTask();
                    task.setOwnerAvatar(this.userClient.getUser(task.getOwner()).getAvatar());
                    task.setAssignedToAvatar(this.userClient.getUser(task.getAssignedTo()).getAvatar());
                    return event;
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/api/calendar/google/events")
    public void createEvents(
            @Valid @RequestBody @NotNull CreateGoogleCalendarEventsParams createGoogleCalendarEventsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        createGoogleCalendarEventsParams.getEvents().forEach((e -> {
            taskDaoJpa.create(createGoogleCalendarEventsParams.getProjectId(), username,
                    Converter.toCreateTaskParams(e), e.getiCalUID(), e.getContent());
        }));
    }

    @GetMapping("/api/calendar/google/calendarList")
    public List<CalendarListEntry> getCalendarList() throws IOException {
        Calendar service = getCalendarService();
        List<CalendarListEntry> result = new ArrayList<>();
        // Iterate through entries in calendar list
        String pageToken = null;
        do {
            CalendarList calendarList = service.calendarList().list().setPageToken(pageToken).execute();
            List<CalendarListEntry> items = calendarList.getItems();

            for (CalendarListEntry calendarListEntry : items) {
                result.add(calendarListEntry);
            }
            pageToken = calendarList.getNextPageToken();
        } while (pageToken != null);

        return result;
    }

    @PostMapping("/api/calendar/google/calendars/{calendarId}/watch")
    public void watchCalendar(@NotNull @PathVariable String calendarId) throws IOException {
        Calendar service = getCalendarService();
        // https://developers.google.com/calendar/v3/reference/events/watch
    }

    @PostMapping("/api/calendar/google/calendars/{calendarId}/unwatch")
    public void unwatchCalendar(@NotNull @PathVariable String calendarId) throws IOException {
        Calendar service = getCalendarService();
        // https://developers.google.com/calendar/v3/reference/channels/stop
    }

    private Calendar getCalendarService() throws IOException {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Credential credential = this.googleCalClient.getFlow().loadCredential(username);
        if (credential == null) {
            throw new BadRequestException("User not logged in");
        }

        // Initialize Calendar service with valid OAuth credentials
        return new Calendar.Builder(
                this.googleCalClient.getHttpTransport(), JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME).build();
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
