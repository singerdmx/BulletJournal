package com.bulletjournal.controller;

import com.bulletjournal.calendars.google.*;
import com.bulletjournal.clients.GoogleCalClient;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.GoogleCalConfig;
import com.bulletjournal.controller.models.LoginStatus;
import com.bulletjournal.controller.models.Project;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.GoogleCalendarProjectDaoJpa;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.models.GoogleCalendarProject;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.net.URI;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class GoogleCalendarController {

    public static final String CHANNEL_NOTIFICATIONS_ROUTE = "/api/calendar/google/channel/notifications";
    public static final String OAUTH_CALL_BACK = "/api/calendar/google/oauth2_basic/callback";
    private static final GsonFactory GSON = new GsonFactory();

    private static final Logger LOGGER = LoggerFactory.getLogger(GoogleCalendarController.class);
    private static final String GOOGLE_CALENDAR_PAGE_PATH = "/#/googleCalendar";
    private static final String GOOGLE_CHANNEL_ID_HEADER = "x-goog-channel-id";
    @Autowired
    private GoogleCalConfig googleCalConfig;

    @Autowired
    private GoogleCalClient googleCalClient;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private GoogleCalendarProjectDaoJpa googleCalendarProjectDaoJpa;

    @Autowired
    private UserClient userClient;

    @Autowired
    private Environment env;

    @PostMapping(value = "/api/calendar/google/login")
    public ResponseEntity<?> loginGoogleCalendar() {
        LOGGER.info("Logging in for Google Calendar");
        String username = MDC.get(UserClient.USER_NAME_KEY);
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setLocation(URI.create(authorize(username)));
        return ResponseEntity.ok().headers(responseHeader).build();
    }

    @RequestMapping(value = OAUTH_CALL_BACK, method = RequestMethod.GET, params = {"code", "state"})
    public RedirectView oauth2Callback(@RequestParam(value = "code") String code,
                                       @RequestParam(value = "state") String username) {
        try {
            TokenResponse response = this.googleCalClient.getFlow().newTokenRequest(code)
                    .setRedirectUri(this.googleCalConfig.getRedirectURI()).execute();
            this.googleCalClient.getFlow().createAndStoreCredential(response, username);
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }

        if (isProd()) {
            return new RedirectView("https://bulletjournal.us/#/googleCalendar");
        }

        return new RedirectView(GOOGLE_CALENDAR_PAGE_PATH);
    }

    private boolean isProd() {
        return Arrays.asList(this.env.getActiveProfiles()).contains("prod");
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
            @RequestParam(name = "startDate", required = false) String startDate, // yyyy-MM-dd
            @RequestParam(name = "endDate", required = false) String endDate)
            throws IOException {
        Calendar service = this.googleCalClient.getCalendarService();
        Calendar.Events.List list = service.events().list(calendarId);
        //        2002-10-02T10:00:00-05:00
        //        2002-10-02T10:00:00+05:00
        OffsetDateTime utc = OffsetDateTime.now(ZoneOffset.UTC);
        if (StringUtils.isNotBlank(startDate)) {
            startDate += "T00:00:00" + ZoneId.of(timezone).getRules().getStandardOffset(utc.toInstant());
            list.setTimeMin(DateTime.parseRfc3339(startDate));
        }
        if (StringUtils.isNotBlank(endDate)) {
            endDate += "T23:59:59" + ZoneId.of(timezone).getRules().getStandardOffset(utc.toInstant());
            list.setTimeMax(DateTime.parseRfc3339(endDate));
        }
        List<Event> events = list.execute().getItems();
        return GoogleCalendarEvent.addAvatar(events.stream()
                .map(e -> Converter.toTask(e, timezone))
                .collect(Collectors.toList()), this.userClient);
    }

    @PostMapping("/api/calendar/google/events")
    public void createEvents(
            @Valid @RequestBody @NotNull CreateGoogleCalendarEventsParams createGoogleCalendarEventsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        createGoogleCalendarEventsParams.getEvents().forEach((e ->
                createTaskFromEvent(createGoogleCalendarEventsParams.getProjectId(), username, e)));
    }

    private void deleteTaskFromEvent(String eventId, com.bulletjournal.repository.models.Project project) {
        taskDaoJpa.deleteTaskByGoogleEvenId(eventId, project);
    }

    private void createTaskFromEvent(Long projectId, String username, GoogleCalendarEvent e) {
        LOGGER.info("createTaskFromEvent: {}", e);
        String text = e.getContent().getText();
        if (StringUtils.isNotBlank(text)) {
            List<String> l = Arrays.stream(e.getContent().getText().split(System.lineSeparator()))
                    .map(s -> "<p>" + s + "</p>").collect(Collectors.toList());
            String html = StringUtils.join(l, "");
            text = "{\"delta\":{\"ops\":[{\"insert\":\"" + text + "\"}]},\"###html###\":\"" + html + "\"}";
        }
        taskDaoJpa.create(projectId, username,
                Converter.toCreateTaskParams(e), e.getEventId(), text);
    }

    @GetMapping("/api/calendar/google/calendarList")
    public List<CalendarListEntry> getCalendarList() throws IOException {
        Calendar service = this.googleCalClient.getCalendarService();
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
    public Project watchCalendar(
            @NotNull @PathVariable String calendarId,
            @Valid @RequestBody @NotNull WatchCalendarParams watchCalendarParams) throws IOException {
        Project project = getWatchedProject(calendarId);
        if (project.getId() != null) {
            throw new BadRequestException("Calendar " + calendarId + " is already watched");
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);
        Channel createdChannel;
        Channel channel = Util.getChannel();

        if (isProd()) {
            Calendar service = this.googleCalClient.getCalendarService();
            // https://developers.google.com/calendar/v3/push
            // https://developers.google.com/calendar/v3/reference/events/watch
            Calendar.Events.Watch watch = service.events().watch(calendarId, channel);
            LOGGER.info("Created watch {}", watch);
            createdChannel = watch.execute();
        } else {
            createdChannel = channel;
            createdChannel.setExpiration(System.currentTimeMillis() + 9_000_000_000L);
        }

        LOGGER.info("Created channel {}", createdChannel);
        GoogleCalendarProject googleCalendarProject = this.googleCalendarProjectDaoJpa.create(
                calendarId, watchCalendarParams.getProjectId(), createdChannel.getId(), GSON.toString(createdChannel),
                getSyncToken(calendarId), username, createdChannel.getExpiration());
        LOGGER.info("Created GoogleCalendarProject {}", googleCalendarProject);
        return googleCalendarProject.getProject().toPresentationModel();
    }

    @PostMapping(CHANNEL_NOTIFICATIONS_ROUTE)
    public void getChannelNotifications(@RequestHeader Map<String, String> headers) throws IOException {
        String channelId = headers.get(GOOGLE_CHANNEL_ID_HEADER);
        GoogleCalendarProject googleCalendarProject = this.googleCalendarProjectDaoJpa.getByChannelId(channelId);
        String token = googleCalendarProject.getToken();
        String calendarId = googleCalendarProject.getId();
        String requester = googleCalendarProject.getOwner();
        LOGGER.info("Notification for channelId {} token {} calendarId {}", channelId, token, calendarId);
        incrementSync(calendarId, token, requester);
    }

    @GetMapping("/api/calendar/google/calendars/{calendarId}/watchedProject")
    public Project getWatchedProject(@NotNull @PathVariable String calendarId) {
        try {
            return this.googleCalendarProjectDaoJpa.get(calendarId).getProject().toPresentationModel();
        } catch (ResourceNotFoundException ex) {
            return new Project();
        }
    }

    @GetMapping("/api/calendar/google/calendars/watchedProjects")
    public List<CalendarWatchedProject> getWatchedProjects() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.googleCalendarProjectDaoJpa.getByOwner(username);
    }

    @PostMapping("/api/calendar/google/calendars/{calendarId}/unwatch")
    public Project unwatchCalendar(@NotNull @PathVariable String calendarId) throws IOException {
        GoogleCalendarProject googleCalendarProject = this.googleCalendarProjectDaoJpa.get(calendarId);
        // https://developers.google.com/calendar/v3/reference/channels/stop
        LOGGER.info("Stopping channel {}", googleCalendarProject.getChannel());
        Channel channel = GSON.fromString(googleCalendarProject.getChannel(), Channel.class);
        LOGGER.info("Retrieved channel {}", channel);
        if (isProd()) {
            Calendar service = this.googleCalClient.getCalendarService();
            service.channels().stop(channel).execute();
        }
        this.googleCalendarProjectDaoJpa.delete(calendarId);
        return googleCalendarProject.getProject().toPresentationModel();
    }

    private String getSyncToken(String calendarId) throws IOException {
        Calendar service = this.googleCalClient.getCalendarService();
        Calendar.Events.List request = service.events().list(calendarId);
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.add(java.util.Calendar.YEAR, -1);
        request.setTimeMin(new DateTime(cal.getTime(), TimeZone.getTimeZone("UTC")));
        Events result = request.execute();
        String syncToken = result.getNextSyncToken();
        return syncToken;
    }

    private void incrementSync(String calendarId, String token, String requester) throws IOException {
        Calendar service = this.googleCalClient.getCalendarService();
        String timezone = service.calendarList().get(calendarId).execute().getTimeZone();
        Calendar.Events.List request = service.events().list(calendarId);
        request.setSyncToken(token);
        Events result = request.execute();
        String syncToken = result.getNextSyncToken();
        GoogleCalendarProject googleCalendarProject =
                this.googleCalendarProjectDaoJpa.setTokenByCalendarId(calendarId, syncToken);
        List<Event> events = result.getItems();
        LOGGER.info("New events: {}", events);
        events.stream()
                .forEach(e -> {
                    if (e.getStatus().equals("cancelled")) {
                        deleteTaskFromEvent(e.getId(), googleCalendarProject.getProject());
                        return;
                    }

                    Optional<com.bulletjournal.repository.models.Task> taskOptional =
                            taskDaoJpa.getTaskByGoogleCalendarEventId(e.getId(), googleCalendarProject.getProject());
                    if (taskOptional.isPresent()) {
                        com.bulletjournal.repository.models.Task task = taskOptional.get();
                        if (taskDaoJpa.isTaskModified(task, requester)) {
                            //dont update since we dont want to overwrite the change on bulletjournal side
                            return;
                        }
                        taskDaoJpa.deleteTask(requester, task.getId());
                    }
                    GoogleCalendarEvent event = Converter.toTask(e, timezone);
                    createTaskFromEvent(googleCalendarProject.getProject().getId(), requester, event);
                });
    }


    private String authorize(String username) {
        if (this.googleCalClient.getFlow() == null) {
            throw new IllegalStateException("Google Calendar Settings missing");
        }
        AuthorizationCodeRequestUrl authorizationUrl;
        authorizationUrl = this.googleCalClient.getFlow().newAuthorizationUrl()
                .setRedirectUri(this.googleCalConfig.getRedirectURI()).setState(username);
        LOGGER.info("authorizationUrl: " + authorizationUrl);
        return authorizationUrl.build();
    }
}
