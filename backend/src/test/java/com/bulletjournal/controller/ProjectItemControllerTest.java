package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
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
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * Tests {@link ProjectController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ProjectItemControllerTest {
    private static final String ROOT_URL = "http://localhost:";
    private final String expectedOwner = "BulletJournal";
    private final String[] sampleUsers = {
            "Michael_Zhou",
    };

    private TestRestTemplate restTemplate = new TestRestTemplate();

    @LocalServerPort
    int randomServerPort;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testGetProjectItems() throws Exception {
        Group group = createGroup();
        String projectName = "P8";
        Project p = createProject(projectName, group);
        Transaction t1 = createTransaction(p, "T1", "2020-02-29");
        Transaction t2 = createTransaction(p, "T2", "2020-03-01");
        Transaction t3 = createTransaction(p, "T3", "2020-03-02");
        Transaction t4 = createTransaction(p, "T4", "2020-03-02");
        Transaction t5 = createTransaction(p, "T5", "2020-03-04");

        List<ProjectItems> projectItems = getProjectItems("2020-02-29",
                                                            "2020-03-02",
                                                            "America/Los_Angeles");
        assertEquals(3, projectItems.size());
        List<ProjectItems> p1 = projectItems.stream().filter( x -> x.getDate().equals(t1.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p1);
        assertEquals(1, p1.size());
        assertEquals(1, p1.get(0).getTransactions().size());
        Transaction t = p1.get(0).getTransactions().get(0);
        assertEquals(t1, t);

        List<ProjectItems> p2 = projectItems.stream().filter( x -> x.getDate().equals(t2.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p2);
        assertEquals(1, p2.size());
        assertEquals(1, p2.get(0).getTransactions().size());
        t = p2.get(0).getTransactions().get(0);
        assertEquals(t2, t);

        List<ProjectItems> p3 = projectItems.stream().filter( x -> x.getDate().equals(t3.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p3);
        assertEquals(1, p3.size());
        assertEquals(2, p3.get(0).getTransactions().size());

        List<ProjectItems> p4 = projectItems.stream().filter( x -> x.getDate().equals(t4.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p3);
        assertEquals(1, p4.size());
        assertEquals(2, p4.get(0).getTransactions().size());

        List<ProjectItems> p5 = projectItems.stream().filter( x -> x.getDate().equals(t5.getDate()))
                .collect(Collectors.toList());
        assertEquals(0, p5.size());
    }

    private List<ProjectItems> getProjectItems(String startDate, String endDate, String timezone) {
        List<ProjectType> types = new ArrayList<>();

        // Added a ledger project type
        types.add(ProjectType.getType(2));

        String url = ROOT_URL + randomServerPort + ProjectItemController.PROJECT_ITEMS_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("types", types)
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .queryParam("timezone", timezone);

        ResponseEntity<ProjectItems[]> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                null,
                ProjectItems[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        return Arrays.asList(response.getBody());
    }

    private Transaction createTransaction(Project project, String name, String date) {
        CreateTransactionParams transaction =
                new CreateTransactionParams( name, "BulletJournal", 1000.0,
                                    date, null, "America/Los_Angeles", 1 );
        ResponseEntity<Transaction> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(transaction),
                Transaction.class,
                project.getId());
        Transaction created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    private Project createProject(String projectName, Group g) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, ProjectType.LEDGER, "d14", g.getId());
        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(project),
                Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(projectName, created.getName());
        assertEquals("BulletJournal", created.getOwner());
        assertEquals(ProjectType.LEDGER, created.getProjectType());
        assertEquals("G14", created.getGroup().getName());
        assertEquals("BulletJournal", created.getGroup().getOwner());
        assertEquals("d14", created.getDescription());
        return created;
    }

    private Group createGroup() {
        CreateGroupParams group = new CreateGroupParams("G14");
        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(group),
                Group.class);
        Group created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals("G14", created.getName());
        assertEquals("BulletJournal", created.getOwner());

        return created;
    }

    private List<GroupsWithOwner> getGroups(List<GroupsWithOwner> expected) {
        ResponseEntity<GroupsWithOwner[]> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.GET,
                null,
                GroupsWithOwner[].class);

        assertNotNull(groupsResponse.getBody());
        List<GroupsWithOwner> groupsBody = Arrays.asList(groupsResponse.getBody());
        if (expected != null) {
            assertEquals(expected.size(), groupsBody.size());
            for (int i = 0; i < expected.size(); i++) {
                assertEquals(expected.get(i), groupsBody.get(i));
            }
        }

        return groupsBody;
    }
}
