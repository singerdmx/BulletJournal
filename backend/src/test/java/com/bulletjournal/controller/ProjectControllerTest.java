package com.bulletjournal.controller;

import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.Project;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateProjectParams;
import com.bulletjournal.repository.models.Group;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests {@link ProjectController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ProjectControllerTest {
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @LocalServerPort
    int randomServerPort;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testCRUD() throws Exception {
        String projectName = "P1";
        String expectedOwner = "BulletJournal";
        CreateProjectParams project = new CreateProjectParams(projectName, ProjectType.LEDGER);
        ResponseEntity<Project> response = this.restTemplate.exchange(
                "http://localhost:" + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(project),
                Project.class);
        Project created = response.getBody();
        Assert.assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Assert.assertEquals(projectName, created.getName());
        Assert.assertEquals(expectedOwner, created.getOwner());
        Assert.assertEquals(ProjectType.LEDGER, created.getProjectType());
        Assert.assertEquals(Group.DEFAULT_NAME, created.getGroup().getName());
        Assert.assertEquals(expectedOwner, created.getGroup().getOwner());

        String projectNewName = "P2";
        UpdateProjectParams updateProjectParams = new UpdateProjectParams();
        updateProjectParams.setName(projectNewName);
        response = this.restTemplate.exchange(
                "http://localhost:" + randomServerPort + ProjectController.PROJECT_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateProjectParams),
                Project.class,
                created.getId());
        Project updated = response.getBody();
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assert.assertEquals(projectNewName, updated.getName());
        Assert.assertEquals(expectedOwner, updated.getOwner());
        Assert.assertEquals(ProjectType.LEDGER, updated.getProjectType());
        Assert.assertEquals(Group.DEFAULT_NAME, created.getGroup().getName());
        Assert.assertEquals(expectedOwner, created.getGroup().getOwner());
    }
}

