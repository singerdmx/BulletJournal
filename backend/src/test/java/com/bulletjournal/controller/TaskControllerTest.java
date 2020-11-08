package com.bulletjournal.controller;


import com.bulletjournal.config.ContentRevisionConfig;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.repository.TaskContentRepository;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.templates.repository.SampleTaskDaoJpa;
import com.bulletjournal.templates.repository.model.SampleTask;
import com.bulletjournal.util.DeltaConverter;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
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

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

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

    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private TaskContentRepository taskContentRepository;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }


    private String generateUpdateContent(String num) {
        String content = "{\"text\":\"{\\\"delta\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"Test Content TEMPLATE\\\\n\\\"}]},\\\"###html###\\\":\\\"<p>Test Content TEMPLATE</p>\\\"}\",\"diff\":\"{\\\"ops\\\":[{\\\"retain\\\":13},{\\\"insert\\\":\\\"TEMPLATE\\\"},{\\\"delete\\\":1}]}\"}";
        return content.replace("TEMPLATE", num);

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
        String testContent1 = DeltaConverter.generateDeltaContent("Test content 1.");
        String testContent2 = DeltaConverter.generateDeltaContent("Test content 2.");
        String testUpdateContent2 = "{\"text\":\"{\\\"delta\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"Test Content 2\\\\n\\\"}]},\\\"###html###\\\":\\\"<p>Test Content 2</p>\\\"}\",\"diff\":\"{\\\"ops\\\":[{\\\"retain\\\":13},{\\\"insert\\\":\\\"2\\\"},{\\\"delete\\\":1}]}\"}";
        String testUpdateContent3 = "{\"text\":\"{\\\"delta\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"Test Content 3\\\\n\\\"}]},\\\"###html###\\\":\\\"<p>Test Content 3</p>\\\"}\",\"diff\":\"{\\\"ops\\\":[{\\\"retain\\\":13},{\\\"insert\\\":\\\"3\\\"},{\\\"delete\\\":1}]}\"}";
        String testUpdateContent4 = "{\"text\":\"{\\\"delta\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"Test Content 4\\\\n\\\"}]},\\\"###html###\\\":\\\"<p>Test Content 4</p>\\\"}\",\"diff\":\"{\\\"ops\\\":[{\\\"retain\\\":13},{\\\"insert\\\":\\\"4\\\"},{\\\"delete\\\":1}]}\"}";

        String testUpdateContent2Expected = "{\"delta\":{\"ops\":[{\"insert\":\"Test Content 2\\n\"}]},\"mdelta\":[{\"insert\":\"Test content 1.\\n\"}],\"###html###\":\"<p>Test Content 2</p>\",\"mdiff\":[[{\"retain\":13},{\"insert\":\"2\"},{\"delete\":1}]]}";
        String testUpdateContent3Expected = "{\"delta\":{\"ops\":[{\"insert\":\"Test Content 3\\n\"}]},\"mdelta\":[{\"insert\":\"Test content 1.\\n\"}],\"###html###\":\"<p>Test Content 3</p>\",\"mdiff\":[[{\"retain\":13},{\"insert\":\"2\"},{\"delete\":1}],[{\"retain\":13},{\"insert\":\"3\"},{\"delete\":1}]]}";
        String testUpdateContent4Expected = "{\"delta\":{\"ops\":[{\"insert\":\"Test Content 4\\n\"}]},\"mdelta\":[{\"insert\":\"Test content 1.\\n\"}],\"###html###\":\"<p>Test Content 4</p>\",\"mdiff\":[[{\"retain\":13},{\"insert\":\"2\"},{\"delete\":1}],[{\"retain\":13},{\"insert\":\"3\"},{\"delete\":1}],[{\"retain\":13},{\"insert\":\"4\"},{\"delete\":1}]]}";
        Group group = TestHelpers.createGroup(requestParams, USER, "Group_ProjectItem");
        List<String> users = new ArrayList<>();
        users.add("xlf");
        users.add("ccc");
        users.add("Joker");
        int count = 1;
        for (String username : users) {
            group = TestHelpers.addUserToGroup(this.requestParams, group, username, ++count, USER);
        }
        users.add(USER);
        Project p1 = TestHelpers.createProject(requestParams, USER, "task_project_1", group, ProjectType.TODO);
        Task task1 = createTask(
                p1,
                new CreateTaskParams("task_1", "2021-01-01", "01:01", 3, new ReminderSetting(), users, TIMEZONE, null));
        Content content1 = addContent(task1, testContent1);
        List<Content> contents1 = updateContent(task1.getId(), content1.getId(), testUpdateContent2);
        List<Content> contents2 = updateContent(task1.getId(), content1.getId(), testUpdateContent3);
        List<Content> contents3 = updateContent(task1.getId(), content1.getId(), testUpdateContent4);
        assertEquals(DeltaConverter.supplementContentText(testContent1), getContentRevision(task1.getId(), content1.getId(), 1L));
        assertEquals(testUpdateContent2Expected, getContentRevision(task1.getId(), content1.getId(), 2L));
        assertEquals(testUpdateContent3Expected, getContentRevision(task1.getId(), content1.getId(), 3L));
        assertEquals(testUpdateContent4Expected, getContentRevision(task1.getId(), content1.getId(), 4L));
        testOtherAssignees(p1, task1, users);
        testUpdateAssignees(p1, task1, users);
        int maxRevisionNumber = revisionConfig.getMaxRevisionNumber();
        for (int i = 0; i < 2 * maxRevisionNumber; ++i) {
            contents1 = updateContent(task1.getId(), content1.getId(), generateUpdateContent(String.valueOf(i)));
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

        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        Date date = new Date(currentTime.getTime());
        String today = new SimpleDateFormat("yyyy-MM-dd").format(date);
        TaskStatistics taskStatistics = getTaskStatistics(Arrays.asList(p1.getId()), TIMEZONE, today, "2022-02-26");
        assertEquals(4, taskStatistics.getCompleted());
        assertEquals(1, taskStatistics.getUncompleted());
        assertEquals(users.size(), taskStatistics.getUserTaskStatistics().size());
    }

    @Test
    @Transactional
    public void testCreateTaskFromSampleTask() throws Exception {
        Long projectId = 1L;
        Long sampleTaskId = 1L;
        String owner = "Scarlet";
        Integer reminderBeforeTask = 1;
        List<String> assignees = Arrays.asList("Xavier", "Scarlet");
        String timeZone = "America/Los_Angeles";

        SampleTask st = sampleTaskDaoJpa.findSampleTaskById(sampleTaskId);
        st.setTimeZone(timeZone);

        com.bulletjournal.templates.controller.model.SampleTask sampleTask = st.toPresentationModel();
        List<com.bulletjournal.repository.models.Task> tasks
            = taskDaoJpa.createTaskFromSampleTask(projectId, owner, ImmutableList.of(sampleTask),
                ImmutableList.of(st), reminderBeforeTask, assignees, new ArrayList<>());
        assertNotNull(tasks.get(0));
        assertEquals(owner, tasks.get(0).getOwner());
        assertTrue(assignees.size() == tasks.get(0).getAssignees().size() && assignees.containsAll(tasks.get(0).getAssignees()));
    }

    private TaskStatistics getTaskStatistics(List<Long> projectIds, String timezone, String startTime, String endTime) {
        String url = ROOT_URL + randomServerPort + TaskController.TASK_STATISTICS_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("projectIds", projectIds)
                .queryParam("timezone", timezone)
                .queryParam("startDate", startTime)
                .queryParam("endDate", endTime);
        ResponseEntity<TaskStatistics> taskStatisticsResponse = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                TaskStatistics.class);
        assertEquals(HttpStatus.OK, taskStatisticsResponse.getStatusCode());
        return taskStatisticsResponse.getBody();
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

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
        }

        ResponseEntity<Notification[]> notificationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NotificationController.NOTIFICATIONS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, "xlf"),
                Notification[].class);
        assertEquals(HttpStatus.OK, notificationsResponse.getStatusCode());
//        Notification[] body = notificationsResponse.getBody();
//        Notification notification = Arrays.asList(body).stream().filter(n -> n.getType().equals("UpdateTaskAssigneeEvent") &&
//                n.getTitle().equals("Task ##task_1## is unassigned by ##999999##")).findAny().get();
//        assertNotNull(notification);
//        assertEquals(USER, notification.getOriginator().getName());

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
//        body = notificationsResponse.getBody();
//        Notification notification = Arrays.asList(body).stream().filter(n -> n.getType().equals("UpdateTaskAssigneeEvent")
//                && n.getTitle().equals("Task ##task_1## is assigned to ##xlf## by ##999999##")).findAny().get();
//        assertNotNull(notification);
//        assertEquals(USER, notification.getOriginator().getName());
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
        Gson gson = new Gson();
        UpdateContentParams params =  gson.fromJson(text, UpdateContentParams.class);
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
        assertEquals(DeltaConverter.supplementContentText(params.getText()), content.getText());
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
}
