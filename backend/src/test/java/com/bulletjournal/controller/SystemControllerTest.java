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

import java.time.ZonedDateTime;
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

    private RequestParams requestParams;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }

    @After
    public void tearDown() {
    }

    @Test
    public void testRemindingTask() throws Exception {
        // Create default testing group
        Group group = TestHelpers.createGroup(requestParams, sampleUsers[0], "Group_SystemControl");

        Project p1 = TestHelpers.createProject(requestParams, sampleUsers[0], "p_SystemControl_task", group, ProjectType.TODO);
        ZonedDateTime due = ZonedDateTimeHelper.getNow("America/Los_Angeles").plusMinutes(30);
        String dueDate = ZonedDateTimeHelper.getDate(due); // today
        String dueTime = ZonedDateTimeHelper.getTime(due); // 30 min later

        Task t1 = createRemindingTask(p1, "T1", 0, dueDate, dueTime);
        Task t2 = createRemindingTask(p1, "T2", 1, dueDate, dueTime);
        Task t3 = createRemindingTask(p1, "T3", 4, dueDate, dueTime);
        Task t4 = createRemindingTask(p1, "T4", 5, dueDate, dueTime);
        Task t5 = createRemindingTask(p1, "T5", 6, dueDate, dueTime);

        SystemUpdates systemUpdates = getRemindingTasks(p1);
        List<Task> remindingTasks = systemUpdates.getReminders();

        assertEquals(2, remindingTasks.size());

        // Check if t3, t4 in the reminding tasks
        TestHelpers.assertIfContains(remindingTasks, t3, t4);

        // Check if t1, t2, t5 not in the reminding tasks
        TestHelpers.assertIfNotContains(remindingTasks, t1, t2, t5);

        deleteTask(t3);

        systemUpdates = getRemindingTasks(p1);
        remindingTasks = systemUpdates.getReminders();

        assertEquals(1, remindingTasks.size());

        // Check if  t4 in the reminding tasks
        TestHelpers.assertIfContains(remindingTasks, t4);

        // Check if t1, t2, t3, t4, t5 not in the reminding tasks
        TestHelpers.assertIfNotContains(remindingTasks, t1, t2, t3, t5);

        String remindingTaskEtag = systemUpdates.getRemindingTaskEtag();
        systemUpdates = testRemindingTaskEtagMatch(p1, remindingTaskEtag);
        assertTrue(systemUpdates.getReminders().isEmpty());

        deleteTask(t1);
        deleteTask(t2);
        deleteTask(t4);
        deleteTask(t5);
        Task recurringRemindingTask = addRecurringRemindingTasks(p1, 1, null, null);
        systemUpdates = getRemindingTasks(p1);
        remindingTasks = systemUpdates.getReminders();
        assertEquals(1, remindingTasks.size());

        List<Task> recurringRemindingTaskList = remindingTasks
                .stream()
                .filter(t -> t.getId().equals(recurringRemindingTask.getId()))
                .collect(Collectors.toList());

        assertNotNull(recurringRemindingTaskList);
        assertNotEquals(0, recurringRemindingTaskList.size());

        deleteTask(recurringRemindingTask);
        String oldGroupsEtag = getGroupsEtag();
        String oldNotificationsEtag = getNotificationsEtag();
        TestHelpers.addUserToGroup(requestParams, group, sampleUsers[1], 2, sampleUsers[0]);
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
        String recurrenceRule = "DTSTART:" + now.toString() + "\nRRULE:FREQ=DAILY;INTERVAL=1";
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
        ReminderSetting reminderSetting = new ReminderSetting(null, null, before);

        CreateTaskParams task = new CreateTaskParams(
                name, date, time, 10, reminderSetting, ImmutableList.of("Michael_Zhou"), "America/Los_Angeles", null);

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
}