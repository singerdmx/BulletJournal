package com.bulletjournal.controller;


import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.google.common.collect.ImmutableList;
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


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class QueryControllerTest {
    private static final String ROOT_URL = "http://localhost:";

    private static final String USER_0518 = "bbs1024";
    private static String TIMEZONE = "America/Los_Angeles";


    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }


    @After
    public void teardown() {

    }

    @Test
    public void test() {
        Group group = createGroup(USER_0518);
        Project p2 = createProject("p_ProjectItem_Task", group, ProjectType.TODO);
        addTasks(p2);


    }

    private Project createProject(String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, type, "d14", g.getId());

        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(project, USER_0518),
                Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(projectName, created.getName());
        assertEquals(USER_0518, created.getOwner().getName());
        assertEquals(type, created.getProjectType());
        assertEquals("Group_ProjectItem", created.getGroup().getName());
        assertEquals(USER_0518, created.getGroup().getOwner().getName());
        assertEquals("d14", created.getDescription());
        return created;
    }

    private Group createGroup(String user) {
        CreateGroupParams group = new CreateGroupParams("Group_ProjectItem");

        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(group, user),
                Group.class);
        Group created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals("Group_ProjectItem", created.getName());
        assertEquals(user, created.getOwner().getName());

        return created;
    }

    private void addTasks(Project p) {
        Task t1 = createTask(p, "hello world", "2020-02-29");
        Task t2 = createTask(p, "love", "2020-03-01");
        addRecentTaskContents(t1, "hello world a test hello worold work");
        addRecentTaskContents(t1, "I love you don't love me");

    }

    private Task createTask(Project project, String name, String date) {
        CreateTaskParams task =
                new CreateTaskParams(name, date, null, 10,
                        new ReminderSetting(), ImmutableList.of(USER_0518), TIMEZONE, null);

        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(task, USER_0518),
                Task.class,
                project.getId());

        Task created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    private Content addRecentTaskContents(Task task, String text) {
        CreateContentParams params = new CreateContentParams(text);
        ResponseEntity<Content> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.ADD_CONTENT_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, USER_0518),
                Content.class,
                task.getId()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Content content = response.getBody();
        assertEquals(USER_0518, content.getOwner().getName());
        assertEquals(params.getText(), content.getText());
        assertNotNull(content.getId());
        return content;
    }
}
