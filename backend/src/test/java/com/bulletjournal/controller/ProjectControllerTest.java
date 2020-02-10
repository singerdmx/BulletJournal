package com.bulletjournal.controller;

import static org.junit.Assert.assertEquals;

import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.Project;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateProjectParams;
import com.bulletjournal.repository.models.Group;
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

import java.util.ArrayList;
import java.util.List;

/**
 * Tests {@link ProjectController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ProjectControllerTest {
    private static final String ROOT_URL = "http://localhost:";
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @LocalServerPort
    int randomServerPort;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testCRUD() throws Exception {
        String projectName = "P0";
        String expectedOwner = "BulletJournal";
        Project p1 = createProject(projectName, expectedOwner);

        // update project name from "P0" to "P1"
        String projectNewName = "P1";
        UpdateProjectParams updateProjectParams = new UpdateProjectParams();
        updateProjectParams.setName(projectNewName);
        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECT_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateProjectParams),
                Project.class,
                p1.getId());
        p1 = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(projectNewName, p1.getName());
        assertEquals(expectedOwner, p1.getOwner());
        assertEquals(ProjectType.LEDGER, p1.getProjectType());
        assertEquals(Group.DEFAULT_NAME, p1.getGroup().getName());
        assertEquals(expectedOwner, p1.getGroup().getOwner());

        // create other projects
        Project p2 = createProject("P2", expectedOwner);
        Project p3 = createProject("P3", expectedOwner);
        Project p4 = createProject("P4", expectedOwner);
        Project p5 = createProject("P5", expectedOwner);
        Project p6 = createProject("P6", expectedOwner);

        /**
         *  p1
         *   |
         *    -- p2
         *   |   |
         *   |    -- p3
         *   |
         *    -- p4
         *
         *  p5
         *   |
         *    -- p6
         */
        List<Project> projectRelations = new ArrayList<>();
        projectRelations.add(p1);
        p1.addSubProject(p2);
        p1.addSubProject(p4);
        p2.addSubProject(p3);
        projectRelations.add(p5);
        p5.addSubProject(p6);
        // Set user's project relations
        this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.PUT,
                new HttpEntity<>(projectRelations),
                Void.class
        );

        ResponseEntity<Project[]> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Project[].class);
        Project[] projects = projectsResponse.getBody();
        assertEquals(2, projects.length);
        assertEquals(p1, projects[0]);
        assertEquals(p5, projects[1]);
        assertEquals(2, projects[0].getSubProjects().size());
        assertEquals(p2, projects[0].getSubProjects().get(0));
        assertEquals(p4, projects[0].getSubProjects().get(1));
        assertEquals(1, projects[1].getSubProjects().size());
        assertEquals(p6, projects[1].getSubProjects().get(0));
        assertEquals(1, projects[0].getSubProjects().get(0).getSubProjects().size());
        assertEquals(p3, projects[0].getSubProjects().get(0).getSubProjects().get(0));
    }

    private Project createProject(String projectName, String expectedOwner) {
        CreateProjectParams project = new CreateProjectParams(projectName, ProjectType.LEDGER);
        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(project),
                Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(projectName, created.getName());
        assertEquals(expectedOwner, created.getOwner());
        assertEquals(ProjectType.LEDGER, created.getProjectType());
        assertEquals(Group.DEFAULT_NAME, created.getGroup().getName());
        assertEquals(expectedOwner, created.getGroup().getOwner());
        return created;
    }
}

