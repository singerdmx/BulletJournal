package com.bulletjournal.controller;


import com.bulletjournal.config.ContentRevisionConfig;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
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

    private static String TIMEZONE = "America/Los_Angeles";

    private static String RECURRENCERULE = "rucurrencerule1";

    @Autowired
    private ContentRevisionConfig revisionConfig;

    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
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
        String testContent1 = "Test content 1.";
        String testContent2 = "Test content 2.";
        String testContent3 = "Test content 3.";
        String testContent4 = "Test content 4.";

        Group group = createGroup();
        Project p1 = createProject("task_project_1", group, ProjectType.TODO);
        Task task1 = createTask(
            p1,
            new CreateTaskParams("task_1", USER, "2021-01-01", "01:01", 3, new ReminderSetting(), TIMEZONE, RECURRENCERULE));
        Content content1 = addContent(task1, testContent1);
        List<Content> contents1 = updateContent(task1.getId(), content1.getId(), testContent2);
        List<Content> contents2 = updateContent(task1.getId(), content1.getId(), testContent3);
        List<Content> contents3 = updateContent(task1.getId(), content1.getId(), testContent4);
        assertEquals(testContent1, getContentRevision(task1.getId(), content1.getId(), 1L));
        assertEquals(testContent2, getContentRevision(task1.getId(), content1.getId(), 2L));
        assertEquals(testContent3, getContentRevision(task1.getId(), content1.getId(), 3L));
        assertEquals(testContent4, getContentRevision(task1.getId(), content1.getId(), 4L));

        int maxRevisionNumber = revisionConfig.getMaxRevisionNumber();
        for (int i = 0; i < 2 * maxRevisionNumber; ++i) {
            contents1 = updateContent(task1.getId(), content1.getId(), testContent1 + String.valueOf(i));
        }
        assertEquals(1, contents1.size());
        assertEquals(maxRevisionNumber, contents1.get(0).getRevisions().length);
    }

    private String getContentRevision(Long taskId, Long contentId, Long revisionId) {
        ResponseEntity<String> response = this.restTemplate.exchange(
            ROOT_URL + randomServerPort + TaskController.CONTENT_REVISIONS_ROUTE,
            HttpMethod.GET,
            TestHelpers.actAsOtherUser(null, USER),
            String.class,
            taskId,
            contentId,
            revisionId
        );
        assertEquals(HttpStatus.OK, response.getStatusCode());
        String text = response.getBody();
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

    private Group createGroup() {
        CreateGroupParams group = new CreateGroupParams("Group_ProjectItem");

        ResponseEntity<Group> response = this.restTemplate.exchange(
            ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
            HttpMethod.POST,
            TestHelpers.actAsOtherUser(group, USER),
            Group.class);
        Group created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals("Group_ProjectItem", created.getName());
        assertEquals(USER, created.getOwner());

        return created;
    }

    private Project createProject(String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
            projectName, type, "d14", g.getId());

        ResponseEntity<Project> response = this.restTemplate.exchange(
            ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
            HttpMethod.POST,
            TestHelpers.actAsOtherUser(project, USER),
            Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(projectName, created.getName());
        assertEquals(USER, created.getOwner());
        assertEquals(type, created.getProjectType());
        assertEquals(g.getName(), created.getGroup().getName());
        assertEquals(USER, created.getGroup().getOwner());
        assertEquals(project.getDescription(), created.getDescription());
        return created;
    }
}
