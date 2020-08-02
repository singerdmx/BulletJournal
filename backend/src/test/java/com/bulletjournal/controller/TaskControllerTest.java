package com.bulletjournal.controller;


import com.bulletjournal.config.ContentRevisionConfig;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.util.DeltaContent;
import com.google.common.collect.ImmutableList;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * Tests {@link TaskController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TaskControllerTest {

    private static final String USER = "999999";

    private static final String ROOT_URL = "http://localhost:";

    private static final String TIMEZONE = "America/Los_Angeles";
    @LocalServerPort
    int randomServerPort;
    @Autowired
    private ContentRevisionConfig revisionConfig;
    private final TestRestTemplate restTemplate = new TestRestTemplate();
    private RequestParams requestParams;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }

    /**
     * Get Groups, use first group
     * Create project
     * Create Task task_1
     * Add content_1 to task_1
     * update content_1 of task_1
     * verify revision
     */
    @Test
    public void testGetContentRevision() {
        String testContent1 = "Test content 1." + DeltaContent.HTML_TAG;
        String testContent2 = "Test content 2." + DeltaContent.HTML_TAG;
        String testContent3 = "Test content 3." + DeltaContent.HTML_TAG;
        String testContent4 = "Test content 4." + DeltaContent.HTML_TAG;

        Group group = TestHelpers.createGroup(requestParams, USER, "Group_ProjectItem");
        List<String> users = new ArrayList<>();
        users.add("xlf");
        users.add("ccc");
        users.add("Joker");
        int count = 1;
        for (String username : users) {
            group = addUserToGroup(group, username, ++count);
        }
        users.add(USER);
        Project p1 = TestHelpers.createProject(requestParams, USER, "task_project_1", group, ProjectType.TODO);
        Task task1 = createTask(
                p1,
                new CreateTaskParams("task_1", "2021-01-01", "01:01", 3, new ReminderSetting(), users, TIMEZONE, null));
        Content content1 = addContent(task1, testContent1);
        List<Content> contents1 = updateContent(task1.getId(), content1.getId(), testContent2);
        List<Content> contents2 = updateContent(task1.getId(), content1.getId(), testContent3);
        List<Content> contents3 = updateContent(task1.getId(), content1.getId(), testContent4);
        assertEquals(testContent1, getContentRevision(task1.getId(), content1.getId(), 1L));
        assertEquals(testContent2, getContentRevision(task1.getId(), content1.getId(), 2L));
        assertEquals(testContent3, getContentRevision(task1.getId(), content1.getId(), 3L));
        assertEquals(testContent4, getContentRevision(task1.getId(), content1.getId(), 4L));
        testOtherAssignees(p1, task1, users);
        testUpdateAssignees(p1, task1, users);
        int maxRevisionNumber = revisionConfig.getMaxRevisionNumber();
        for (int i = 0; i < 2 * maxRevisionNumber; ++i) {
            contents1 = updateContent(task1.getId(), content1.getId(), testContent1 + i);
        }
        assertEquals(1, contents1.size());
        assertEquals(maxRevisionNumber, contents1.get(0).getRevisions().length);


        // borrowing test for testing task pagination
        Task task2 = createTask(p1, new CreateTaskParams("task2", "2020-02-27",
                null, null, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));
        Task task3 = createTask(p1, new CreateTaskParams("task3", "2020-02-27",
                null, null, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));
        Task task4 = createTask(p1, new CreateTaskParams("task4", "2020-02-27",
                null, null, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));
        Task task5 = createTask(p1, new CreateTaskParams("task5", "2020-02-27",
                null, null, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));


        task2 = completeTask(task2.getId());
        task3 = completeTask(task3.getId());
        task4 = completeTask(task4.getId());
        task5 = completeTask(task5.getId());

        // get completed task, first page, 2 items
        String url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + TaskController.COMPLETED_TASKS_ROUTE)
                .queryParam("pageNo", 0)
                .queryParam("pageSize", 2)
                .buildAndExpand(p1.getId()).toUriString();
        ResponseEntity<Task[]> completedTasksResponse = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                Task[].class,
                p1.getId());

        assertEquals(HttpStatus.OK, completedTasksResponse.getStatusCode());
        assertNotNull(completedTasksResponse.getBody());
        List<Task> completedTasks = Arrays.asList(completedTasksResponse.getBody());
        assertEquals(2, completedTasks.size());
        assertEquals("task5", completedTasks.get(0).getName());
        assertEquals("task4", completedTasks.get(1).getName());

        // second page
        url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + TaskController.COMPLETED_TASKS_ROUTE)
                .queryParam("pageNo", 1)
                .queryParam("pageSize", 2)
                .buildAndExpand(p1.getId()).toUriString();
        completedTasksResponse = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                Task[].class,
                p1.getId());

        assertEquals(HttpStatus.OK, completedTasksResponse.getStatusCode());
        assertNotNull(completedTasksResponse.getBody());
        completedTasks = Arrays.asList(completedTasksResponse.getBody());
        assertEquals(2, completedTasks.size());
        assertEquals("task3", completedTasks.get(0).getName());
        assertEquals("task2", completedTasks.get(1).getName());

        // default
        completedTasksResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.COMPLETED_TASKS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                Task[].class,
                p1.getId());

        assertEquals(HttpStatus.OK, completedTasksResponse.getStatusCode());
        assertNotNull(completedTasksResponse.getBody());
        completedTasks = Arrays.asList(completedTasksResponse.getBody());
        assertEquals(4, completedTasks.size());
    }

    private void testUpdateAssignees(Project p1, Task task, List<String> users) {
        users.remove("xlf");
        UpdateTaskParams updateTaskParams = new UpdateTaskParams(
                task.getDueDate(), task.getDueTime(), task.getName(), null,
                task.getReminderSetting(), users, TIMEZONE, null, null);
        ResponseEntity<Task[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASK_ROUTE,
                HttpMethod.PATCH,
                TestHelpers.actAsOtherUser(updateTaskParams, USER),
                Task[].class,
                task.getId());
        assertEquals(HttpStatus.OK, response.getStatusCode());

        ResponseEntity<Notification[]> notificationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NotificationController.NOTIFICATIONS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, "xlf"),
                Notification[].class);
        assertEquals(HttpStatus.OK, notificationsResponse.getStatusCode());
        Notification[] body = notificationsResponse.getBody();
        Notification notification = Arrays.asList(body).stream().filter(n -> n.getType().equals("UpdateTaskAssigneeEvent") &&
                n.getTitle().equals("Task ##task_1## is unassigned by ##999999##")).findAny().get();
        assertNotNull(notification);
        assertEquals(USER, notification.getOriginator().getName());

        users.add("xlf");
        updateTaskParams = new UpdateTaskParams(
                task.getDueDate(), task.getDueTime(), task.getName(), null,
                task.getReminderSetting(), users, TIMEZONE, null, null);
        response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASK_ROUTE,
                HttpMethod.PATCH,
                TestHelpers.actAsOtherUser(updateTaskParams, USER),
                Task[].class,
                task.getId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        notificationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NotificationController.NOTIFICATIONS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, "xlf"),
                Notification[].class);
        assertEquals(HttpStatus.OK, notificationsResponse.getStatusCode());
        body = notificationsResponse.getBody();
        notification = Arrays.asList(body).stream().filter(n -> n.getType().equals("UpdateTaskAssigneeEvent")
                && n.getTitle().equals("Task ##task_1## is assigned to ##xlf## by ##999999##")).findAny().get();
        assertNotNull(notification);
        assertEquals(USER, notification.getOriginator().getName());
    }

    private void testOtherAssignees(Project p1, Task task1, List<String> users) {
        for (String user : users) {
            ResponseEntity<Task[]> tasksResponse = this.restTemplate.exchange(
                    ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                    HttpMethod.GET,
                    TestHelpers.actAsOtherUser(null, USER),
                    Task[].class,
                    p1.getId());
            List<Task> tasks = Arrays.asList(tasksResponse.getBody());
            assertEquals(task1, tasks.get(0));
        }
    }

    private Task completeTask(long taskId) {
        ResponseEntity<Task> completeTaskResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.COMPLETE_TASK_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(null, USER),
                Task.class,
                taskId);

        assertEquals(HttpStatus.OK, completeTaskResponse.getStatusCode());
        assertNotNull(completeTaskResponse.getBody());
        return completeTaskResponse.getBody();
    }

    private String getContentRevision(Long taskId, Long contentId, Long revisionId) {
        ResponseEntity<Revision> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.CONTENT_REVISIONS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                Revision.class,
                taskId,
                contentId,
                revisionId
        );
        assertEquals(HttpStatus.OK, response.getStatusCode());
        String text = response.getBody().getContent();
        return text;
    }

    private List<Content> updateContent(Long taskId, Long contentId, String text) {
        UpdateContentParams params = new UpdateContentParams(text);
        ResponseEntity<Content[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.CONTENT_ROUTE,
                HttpMethod.PATCH,
                TestHelpers.actAsOtherUser(params, USER),
                Content[].class,
                taskId,
                contentId
        );
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<Content> contents = Arrays.asList(response.getBody());
        return contents;
    }

    private Content addContent(Task task, String text) {
        CreateContentParams params = new CreateContentParams(text);
        ResponseEntity<Content> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.ADD_CONTENT_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, USER),
                Content.class,
                task.getId()
        );

        Content content = response.getBody();
        assertEquals(params.getText(), content.getText());
        return content;
    }

    private Task createTask(
            Project project, CreateTaskParams params
    ) {
        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, USER),
                Task.class,
                project.getId());
        Task created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(params.getName(), created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    private Group addUserToGroup(Group group, String username, int expectedSize) {
        AddUserGroupParams addUserGroupParams = new AddUserGroupParams(group.getId(), username);
        ResponseEntity<Group> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.ADD_USER_GROUP_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(addUserGroupParams, USER),
                Group.class);
        Group updated = groupsResponse.getBody();
        assertEquals(expectedSize, updated.getUsers().size());
        return updated;
    }
}
