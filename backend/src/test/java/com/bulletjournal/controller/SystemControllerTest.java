package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.google.common.collect.ImmutableList;
import org.dmfs.rfc5545.DateTime;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.TimeZone;
import java.util.stream.Collectors;

import static java.lang.Thread.sleep;
import static org.junit.Assert.*;

/**
 * Tests {@link SystemController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class SystemControllerTest {
    private static final int ETAG_TEST_RETRY = 10;
    private static final String ROOT_URL = "http://localhost:";
    private static String TIMEZONE = "America/Los_Angeles";
    private final String[] sampleUsers = {
            "Michael_Zhou", "Xavier"
    };
    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @After
    public void tearDown() {
    }

    @Test
    public void testRemindingTask() throws Exception {
        // Create default testing group
        Group group = createGroup();

        Project p1 = createProject("p_SystemControl_Task", group, ProjectType.TODO);

        Task t1 = createRemindingTask(p1, "T1", 0,
                ZonedDateTimeHelper.getNow().plusHours(2).format(ZonedDateTimeHelper.DATE_FORMATTER), null);
        Task t2 = createRemindingTask(p1, "T2", 1,
                ZonedDateTimeHelper.getNow().plusHours(2).format(ZonedDateTimeHelper.DATE_FORMATTER), null);
        Task t3 = createRemindingTask(p1, "T3", 2,
                ZonedDateTimeHelper.getNow().plusHours(2).format(ZonedDateTimeHelper.DATE_FORMATTER), null);
        Task t4 = createRemindingTask(p1, "T4", 3,
                ZonedDateTimeHelper.getNow().plusHours(2).format(ZonedDateTimeHelper.DATE_FORMATTER), null);
        Task t5 = createRemindingTask(p1, "T5", 6,
                ZonedDateTimeHelper.getNow().plusHours(2).format(ZonedDateTimeHelper.DATE_FORMATTER), null);

        SystemUpdates systemUpdates = getRemindingTasks(p1);
        List<Task> remindingTasks = systemUpdates.getReminders();

        assertEquals(4, remindingTasks.size());

        // Check if t1, t2, t3, t4 in the reminding tasks
        TestHelpers.assertIfContains(remindingTasks, t1, t2, t3, t4);

        // Check if t5 not in the reminding tasks
        TestHelpers.assertIfNotContains(remindingTasks, t5);

        deleteTask(t1);

        systemUpdates = getRemindingTasks(p1);
        remindingTasks = systemUpdates.getReminders();

        assertEquals(3, remindingTasks.size());

        // Check if t2, t3, t4 in the reminding tasks
        TestHelpers.assertIfContains(remindingTasks, t2, t3, t4);

        // Check if t5 not in the reminding tasks
        TestHelpers.assertIfNotContains(remindingTasks, t5);

        String remindingTaskEtag = systemUpdates.getRemindingTaskEtag();
        systemUpdates = testRemindingTaskEtagMatch(p1, remindingTaskEtag);
        assertNull(systemUpdates.getReminders());

        Task recurringRemindingTask = addRecurringRemindingTasks(p1, 5, null, null);
        systemUpdates = getRemindingTasks(p1);
        remindingTasks = systemUpdates.getReminders();
        assertEquals(4, remindingTasks.size());

        List<Task> recurringRemindingTaskList = remindingTasks
                .stream()
                .filter(t -> t.getId().equals(recurringRemindingTask.getId()))
                .collect(Collectors.toList());

        assertNotNull(recurringRemindingTaskList);
        assertNotEquals(0, recurringRemindingTaskList.size());

        deleteTask(recurringRemindingTask);
        deleteTask(t2);
        deleteTask(t3);
        deleteTask(t4);
        deleteTask(t5);

        String oldGroupsEtag = getGroupsEtag();
        addUserToGroup(group, sampleUsers[1], 2);
        boolean flag = false;
        for (int i = 0; i < ETAG_TEST_RETRY; i++) {
            String newGroupsEtag = getGroupsEtag();
            if (!oldGroupsEtag.equals(newGroupsEtag)) {
                flag = true;
                break;
            }
            sleep(2000);
        }
        assertTrue(flag);

        String oldNotificationsEtag = getNotificationsEtag();
        createTask(p1, new CreateTaskParams("task_for_notification_etag", "2022-02-27",
                null, null, new ReminderSetting(), ImmutableList.of(sampleUsers[1]), TIMEZONE, null));
        flag = false;
        for (int i = 0; i < ETAG_TEST_RETRY; i++) {
            String newNotificationsEtag = getNotificationsEtag();
            if (!oldNotificationsEtag.equals(newNotificationsEtag)) {
                flag = true;
                break;
            }
            sleep(2000);
        }
        assertTrue(flag);
    }

    private Task createTask(
            Project project, CreateTaskParams params
    ) {
        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, sampleUsers[0]),
                Task.class,
                project.getId());
        Task created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(params.getName(), created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    private String getNotificationsEtag() {
        String url = ROOT_URL + randomServerPort + SystemController.UPDATES_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("targets", "notificationsEtag");

        ResponseEntity<SystemUpdates> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, sampleUsers[1]),
                SystemUpdates.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        SystemUpdates systemUpdates = response.getBody();
        assertNotNull(systemUpdates);
        return systemUpdates.getNotificationsEtag();
    }

    private Group addUserToGroup(Group group, String username, int expectedSize) {
        AddUserGroupParams addUserGroupParams = new AddUserGroupParams(group.getId(), username);
        ResponseEntity<Group> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.ADD_USER_GROUP_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(addUserGroupParams, sampleUsers[0]),
                Group.class);
        Group updated = groupsResponse.getBody();
        assertEquals(expectedSize, updated.getUsers().size());
        return updated;
    }

    private String getGroupsEtag() {
        String url = ROOT_URL + randomServerPort + SystemController.UPDATES_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("targets", "groupsEtag");

        ResponseEntity<SystemUpdates> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, sampleUsers[0]),
                SystemUpdates.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        SystemUpdates systemUpdates = response.getBody();
        assertNotNull(systemUpdates);
        return systemUpdates.getGroupsEtag();
    }

    private Task addRecurringRemindingTasks(Project project, Integer before, String date, String time) {
        DateTime now = DateTime.now(TimeZone.getTimeZone(TIMEZONE));
        String recurrenceRule = "DTSTART:" + now.toString() + " RRULE:FREQ=HOURLY;INTERVAL=1";
        String taskName = "rt1";
        ReminderSetting reminderSetting = new ReminderSetting(date, time, before);

        CreateTaskParams task = new CreateTaskParams(taskName, null,
                null, null, reminderSetting, ImmutableList.of(sampleUsers[0]), TIMEZONE, recurrenceRule);
        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(task, sampleUsers[0]),
                Task.class,
                project.getId());
        Task createdTask = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(taskName, createdTask.getName());
        assertEquals(project.getId(), createdTask.getProjectId());

        return createdTask;
    }

    private void deleteTask(Task task) {
        ResponseEntity<Task[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASK_ROUTE, // this is TASK bc one task?
                HttpMethod.DELETE,
                TestHelpers.actAsOtherUser(null, sampleUsers[0]),
                Task[].class,
                task.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    private SystemUpdates testRemindingTaskEtagMatch(Project p, String eTag) {
        String url = ROOT_URL + randomServerPort + SystemController.UPDATES_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("targets", "taskReminders");

        ResponseEntity<SystemUpdates> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, sampleUsers[0], eTag),
                SystemUpdates.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        SystemUpdates systemUpdates = response.getBody();
        assertNotNull(systemUpdates);
        return systemUpdates;
    }

    private SystemUpdates getRemindingTasks(Project p) {
        String url = ROOT_URL + randomServerPort + SystemController.UPDATES_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("targets", "taskReminders");

        ResponseEntity<SystemUpdates> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, sampleUsers[0]),
                SystemUpdates.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        SystemUpdates systemUpdates = response.getBody();
        assertNotNull(systemUpdates);

        return systemUpdates;
    }

    private Task createRemindingTask(Project project, String name, Integer before, String date, String time) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        ZonedDateTime now = ZonedDateTime.now();

        ZonedDateTime dueZonedDateTime = getDueDateTime(now, before, 5, ChronoUnit.MINUTES);

        String dueDateTime = dueZonedDateTime.format(formatter);
        String dueDate = dueDateTime.split(" ")[0];
        String dueTime = dueDateTime.split(" ")[1];

        String remindingDateTime = getReminderDateTime(dueZonedDateTime, before).format(formatter);
        String remindingDate = remindingDateTime.split(" ")[0];
        String remindingTime = remindingDateTime.split(" ")[1];

        ReminderSetting reminderSetting = new ReminderSetting(remindingDate, remindingTime, before);

        CreateTaskParams task = new CreateTaskParams(
                name, dueDate, dueTime, 10, reminderSetting, ImmutableList.of("Michael_Zhou"), "America/Los_Angeles", null);

        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(task, sampleUsers[0]),
                Task.class,
                project.getId());

        Task created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    private Group createGroup() {
        CreateGroupParams group = new CreateGroupParams("Group_SystemControl");

        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(group, sampleUsers[0]),
                Group.class);
        Group created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals("Group_SystemControl", created.getName());
        assertEquals("Michael_Zhou", created.getOwner().getName());

        return created;
    }

    private Project createProject(String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, type, "d15", g.getId());

        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(project, sampleUsers[0]),
                Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(projectName, created.getName());
        assertEquals("Michael_Zhou", created.getOwner().getName());
        assertEquals(type, created.getProjectType());
        assertEquals("Group_SystemControl", created.getGroup().getName());
        assertEquals("Michael_Zhou", created.getGroup().getOwner().getName());
        assertEquals("d15", created.getDescription());
        return created;
    }

    private ZonedDateTime getDueDateTime(ZonedDateTime startTime, Integer after, int amount, ChronoUnit unit) {
        Instant reminderInstant = startTime.toInstant();
        ZoneId zoneId = ZoneId.of("America/Los_Angeles");
        if (after != null) {
            switch (after) {
                case 0:
                    return ZonedDateTime.ofInstant(reminderInstant, zoneId);
                case 1:
                    reminderInstant = reminderInstant.plus(5, ChronoUnit.MINUTES);
                    return ZonedDateTime.ofInstant(reminderInstant, zoneId);
                case 2:
                    reminderInstant = reminderInstant.plus(10, ChronoUnit.MINUTES);
                    break;
                case 3:
                    reminderInstant = reminderInstant.plus(30, ChronoUnit.MINUTES);
                    break;
                case 4:
                    reminderInstant = reminderInstant.plus(1, ChronoUnit.HOURS);
                    break;
                case 5:
                    reminderInstant = reminderInstant.plus(2, ChronoUnit.HOURS);
                    break;
                default:
            }
        }
        reminderInstant = reminderInstant.minus(amount, unit);

        return ZonedDateTime.ofInstant(reminderInstant, zoneId);
    }

    /*
     * Get Reminder Date Time
     *
     *
     */
    private ZonedDateTime getReminderDateTime(ZonedDateTime startTime, Integer before) {
        Instant reminderInstant;
        switch (before) {
            case 0:
                reminderInstant = startTime.toInstant();
                break;
            case 1:
                reminderInstant = startTime.toInstant().minus(5, ChronoUnit.MINUTES);
                break;
            case 2:
                reminderInstant = startTime.toInstant().minus(10, ChronoUnit.MINUTES);
                break;
            case 3:
                reminderInstant = startTime.toInstant().minus(30, ChronoUnit.MINUTES);
                break;
            case 4:
                reminderInstant = startTime.toInstant().minus(1, ChronoUnit.HOURS);
                break;
            case 5:
                reminderInstant = startTime.toInstant().minus(2, ChronoUnit.HOURS);
                break;
            case 6:
                reminderInstant = Instant.EPOCH.plusMillis(Long.MAX_VALUE);
                break;
            default:
                throw new IllegalArgumentException();
        }
        ZoneId zoneId = ZoneId.of("America/Los_Angeles");
        return ZonedDateTime.ofInstant(reminderInstant, zoneId);
    }
}