package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.ProjectRelationsProcessorTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertNotNull;

/**
 * Tests {@link ProjectController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ProjectControllerEtagTest {
    private static final String ROOT_URL = "http://localhost:";
    private final String expectedOwner = "BulletJournal";
    private final String unexpectedOwner = "Hacker";

    private final String[] sampleUsers = {
            "Xavier",
            "bbs1024",
            "ccc",
            "Thinker",
            "Joker",
            "mqm",
            "hero",
            "bean",
            "xlf",
            "999999",
            "0518",
            "Scarlet",
            "lsx9981"};
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @LocalServerPort
    int randomServerPort;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testProjectsEag() throws Exception {
        String projectName = "P0";

        Project p1 = createProject(projectName, expectedOwner);
        p1 = updateProject(p1);

        // create other projects
        Project p2 = createProject("P2", expectedOwner);
        Project p3 = createProject("P3", expectedOwner);
        Project p4 = createProject("P4", expectedOwner);
        Project p5 = createProject("P5", expectedOwner);
        Project p6 = createProject("P6", expectedOwner);

        ResponseEntity<Projects> firstResponse = updateProjectRelations(p1, p2, p3, p4, p5, p6);
        String eTagFromFirstResponse = firstResponse.getHeaders().getETag();
        validateProjectResponseEtagMatch(eTagFromFirstResponse);

        p1 = updateProjectNameDescription(p1);
        ResponseEntity<Projects> secondResponse = updateProjectRelationsV1(p2, p1, p3, p4, p5, p6);
        String eTagFromSecondResponse = secondResponse.getHeaders().getETag();
        validateProjectResponseEtagNotMatch(eTagFromFirstResponse);
        validateProjectResponseEtagMatch(eTagFromSecondResponse);
    }

    private Project updateProjectNameDescription(Project p) {
        // update project name to "P11"
        UpdateProjectParams updateProjectParams = new UpdateProjectParams();
        updateProjectParams.setName("P11");
        updateProjectParams.setDescription("ddddd");
        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECT_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateProjectParams),
                Project.class,
                p.getId());
        p = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("P11", p.getName());
        assertEquals(expectedOwner, p.getOwner());
        assertEquals(ProjectType.LEDGER, p.getProjectType());
        assertEquals(com.bulletjournal.repository.models.Group.DEFAULT_NAME, p.getGroup().getName());
        assertEquals(expectedOwner, p.getGroup().getOwner());
        return p;
    }

    private void validateProjectResponseEtagMatch(String matchETag) {
        HttpHeaders eTagRequestHeader = new HttpHeaders();
        eTagRequestHeader.setIfNoneMatch(matchETag);
        HttpEntity eTagRequestEntity = new HttpEntity(eTagRequestHeader);

        ResponseEntity<Projects> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                eTagRequestEntity,
                Projects.class);

        assertEquals(HttpStatus.NOT_MODIFIED, projectsResponse.getStatusCode());
        assertNull(projectsResponse.getBody());
    }

    private void validateProjectResponseEtagNotMatch(String notMatchEtag) {
        HttpHeaders eTagRequestHeader = new HttpHeaders();
        eTagRequestHeader.setIfNoneMatch(notMatchEtag);
        HttpEntity eTagRequestEntity = new HttpEntity(eTagRequestHeader);

        ResponseEntity<Projects> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                eTagRequestEntity,
                Projects.class);

        assertNotEquals(HttpStatus.NOT_MODIFIED, projectsResponse.getStatusCode());
        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());
        assertNotNull(projectsResponse.getBody());
    }

    private ResponseEntity<Projects> updateProjectRelationsV1(Project p1, Project p2, Project p3,
                                                            Project p4, Project p5, Project p6) {
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
        List<Project> projectRelations = ProjectRelationsProcessorTest.createSampleProjectRelations(
                p1, p2, p3, p4, p5, p6);
        // Set user's project relations
        ResponseEntity<?> updateProjectRelationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.PUT,
                new HttpEntity<>(projectRelations),
                Void.class
        );
        assertEquals(HttpStatus.OK, updateProjectRelationsResponse.getStatusCode());

        ResponseEntity<Projects> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);
        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());

        return projectsResponse;
    }

    private ResponseEntity<Projects> updateProjectRelations(Project p1, Project p2, Project p3,
                                                            Project p4, Project p5, Project p6) {
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
        List<Project> projectRelations = ProjectRelationsProcessorTest.createSampleProjectRelations(
                p1, p2, p3, p4, p5, p6);
        // Set user's project relations
        ResponseEntity<?> updateProjectRelationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.PUT,
                new HttpEntity<>(projectRelations),
                Void.class
        );
        assertEquals(HttpStatus.OK, updateProjectRelationsResponse.getStatusCode());

        ResponseEntity<Projects> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);
        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());
        List<Project> projects = projectsResponse.getBody().getOwned();
        assertEquals(2, projects.size());
        assertEquals(p1, projects.get(0));
        assertEquals(p5, projects.get(1));
        assertEquals(2, projects.get(0).getSubProjects().size());
        assertEquals(p2, projects.get(0).getSubProjects().get(0));
        assertEquals(p4, projects.get(0).getSubProjects().get(1));
        assertEquals(1, projects.get(1).getSubProjects().size());
        assertEquals(p6, projects.get(1).getSubProjects().get(0));
        assertEquals(1, projects.get(0).getSubProjects().get(0).getSubProjects().size());
        assertEquals(p3, projects.get(0).getSubProjects().get(0).getSubProjects().get(0));

        List<ProjectsWithOwner> projectsWithOwners = projectsResponse.getBody().getShared();
        assertEquals(2, projectsWithOwners.size());
        projects = projectsWithOwners.get(0).getProjects();
        assertEquals(2, projects.size());
        assertEquals("P1", projects.get(0).getName());
        assertEquals("P5", projects.get(1).getName());
        assertEquals(2, projects.get(0).getSubProjects().size());
        assertEquals("P2", projects.get(0).getSubProjects().get(0).getName());
        assertEquals("P4", projects.get(0).getSubProjects().get(1).getName());
        assertEquals(1, projects.get(1).getSubProjects().size());
        assertEquals("P6", projects.get(1).getSubProjects().get(0).getName());
        assertEquals(1, projects.get(0).getSubProjects().get(0).getSubProjects().size());
        assertEquals("P3", projects.get(0).getSubProjects().get(0).getSubProjects().get(0).getName());

        return projectsResponse;
    }

    private Project updateProject(Project p1) {
        // update project name from "P0" to "P1"
        String projectNewName = "P1";
        UpdateProjectParams updateProjectParams = new UpdateProjectParams();
        updateProjectParams.setName(projectNewName);
        updateProjectParams.setDescription("d2");
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
        assertEquals(com.bulletjournal.repository.models.Group.DEFAULT_NAME, p1.getGroup().getName());
        assertEquals(expectedOwner, p1.getGroup().getOwner());
        assertEquals("d2", p1.getDescription());
        return p1;
    }

    private Project createProject(String projectName, String expectedOwner) {
        CreateProjectParams project = new CreateProjectParams(projectName, ProjectType.LEDGER, "d1");
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
        assertEquals(com.bulletjournal.repository.models.Group.DEFAULT_NAME, created.getGroup().getName());
        assertEquals(expectedOwner, created.getGroup().getOwner());
        assertEquals("d1", created.getDescription());
        return created;
    }
}

