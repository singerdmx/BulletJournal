package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * Tests {@link ProjectController}
 * <p>
 * Transaction:
 * "2020-02-29"
 * "2020-03-01"
 * "2020-03-02"
 * "2020-03-02"
 * "2020-03-04"
 * Task:
 * "2020-02-28"
 * "2020-02-29"
 * "2020-03-01"
 * "2020-03-02"
 * "2020-03-02"
 * "2020-03-04"
 * "2020-03-04"
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ProjectItemControllerTest {
    private static final String ROOT_URL = "http://localhost:";
    private static String TIMEZONE = "America/Los_Angeles";
    private final String expectedOwner = "BulletJournal";
    private final String[] sampleUsers = {
            "Michael_Zhou",
            "Xavier"
    };
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
    public void testGetProjectItems() throws Exception {
        // Create default testing group
        Group group = createGroup();

        /*
         * Transaction:
         *     "2020-02-29"
         *     "2020-03-01"
         *     "2020-03-02"
         *     "2020-03-02"
         *     "2020-03-04"
         */
        Project p1 = createProject("p_ProjectItem_Ledger", group, ProjectType.LEDGER);
        addTransactions(p1);

        /*
         * Task:
         *     "2020-02-28"
         *     "2020-02-29"
         *     "2020-03-01"
         *     "2020-03-02"
         *     "2020-03-02"
         *     "2020-03-04"
         *     "2020-03-04"
         */
        Project p2 = createProject("p_ProjectItem_Task", group, ProjectType.TODO);
        addTasks(p2);

        /*
         * Project Items:
         *     "2020-02-28"
         *     "2020-02-29"
         *     "2020-03-01"
         *     "2020-03-02"
         *     "2020-03-04"
         */
        List<ProjectType> types = getTypes(ProjectType.TODO, ProjectType.LEDGER);
        List<ProjectItems> projectItems = getProjectItems("2020-02-28",
                "2020-03-04",
                "America/Los_Angeles",
                types);

        assertNotNull(projectItems);
        assertEquals(5, projectItems.size());
        assertEquals("2020-03-04", projectItems.get(0).getDate());
        assertEquals(1, projectItems.get(0).getTransactions().size());
        assertEquals(2, projectItems.get(0).getTasks().size());
        assertEquals("2020-03-02", projectItems.get(1).getDate());
        assertEquals(2, projectItems.get(1).getTransactions().size());
        assertEquals(2, projectItems.get(1).getTasks().size());
        assertEquals("2020-03-01", projectItems.get(2).getDate());
        assertEquals(1, projectItems.get(2).getTransactions().size());
        assertEquals(1, projectItems.get(2).getTasks().size());
        assertEquals("2020-02-29", projectItems.get(3).getDate());
        assertEquals(1, projectItems.get(3).getTransactions().size());
        assertEquals(1, projectItems.get(3).getTasks().size());
        assertEquals("2020-02-28", projectItems.get(4).getDate());
        assertEquals(0, projectItems.get(4).getTransactions().size());
        assertEquals(1, projectItems.get(4).getTasks().size());

        List<ProjectItems> projectItemsOtherUser = getProjectItemsOtherUser("2020-02-28",
                "2020-03-04",
                TIMEZONE,
                types);
        assertNotNull(projectItemsOtherUser);
        assertEquals(0, projectItemsOtherUser.size());

        // "DTSTART:20200320T080000Z RRULE:FREQ=WEEKLY;INTERVAL=1"
        Task recurTask = addRecurringTasks(p2);
        List<ProjectItems> projectItemsRecurring = getProjectItems("2020-04-20",
                "2020-05-01",
                TIMEZONE,
                types);
        assertNotNull(projectItemsRecurring);
        assertEquals(2, projectItemsRecurring.size());
        assertEquals("rt1", projectItemsRecurring.get(0).getTasks().get(0).getName());
        assertEquals("rt1", projectItemsRecurring.get(1).getTasks().get(0).getName());
        assertEquals("2020-04-27", projectItemsRecurring.get(0).getTasks().get(0).getDueDate());
        assertEquals("2020-04-20", projectItemsRecurring.get(1).getTasks().get(0).getDueDate());
        deleteTask(recurTask);
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

    private List<ProjectItems> getProjectItemsOtherUser(String startDate, String endDate, String timezone, List<ProjectType> types) {

        String url = ROOT_URL + randomServerPort + ProjectItemController.PROJECT_ITEMS_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("types", types)
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .queryParam("timezone", timezone);

        ResponseEntity<ProjectItems[]> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, sampleUsers[1]),
                ProjectItems[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        return Arrays.asList(response.getBody());
    }

    private void addTransactions(Project p) {
        Transaction t1 = createTransaction(p, "T1", "2020-02-29");
        Transaction t2 = createTransaction(p, "T2", "2020-03-01");
        Transaction t3 = createTransaction(p, "T3", "2020-03-02");
        Transaction t4 = createTransaction(p, "T4", "2020-03-02");
        Transaction t5 = createTransaction(p, "T5", "2020-03-04");

        List<ProjectType> types = getTypes(ProjectType.LEDGER); // Added a transaction project type

        List<ProjectItems> projectItems = getProjectItems("2020-02-29",
                "2020-03-02",
                "America/Los_Angeles",
                types);
        assertEquals(3, projectItems.size());
        List<ProjectItems> p1 = projectItems.stream().filter(x -> x.getDate().equals(t1.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p1);
        assertEquals(1, p1.size());
        assertEquals(1, p1.get(0).getTransactions().size());
        Transaction t = p1.get(0).getTransactions().get(0);
        assertEquals(t1, t);

        List<ProjectItems> p2 = projectItems.stream().filter(x -> x.getDate().equals(t2.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p2);
        assertEquals(1, p2.size());
        assertEquals(1, p2.get(0).getTransactions().size());
        t = p2.get(0).getTransactions().get(0);
        assertEquals(t2, t);

        List<ProjectItems> p3 = projectItems.stream().filter(x -> x.getDate().equals(t3.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p3);
        assertEquals(1, p3.size());
        assertEquals(2, p3.get(0).getTransactions().size());

        List<ProjectItems> p4 = projectItems.stream().filter(x -> x.getDate().equals(t4.getDate()))
                .collect(Collectors.toList());
        assertNotNull(p3);
        assertEquals(1, p4.size());
        assertEquals(2, p4.get(0).getTransactions().size());

        List<ProjectItems> p5 = projectItems.stream().filter(x -> x.getDate().equals(t5.getDate()))
                .collect(Collectors.toList());
        assertEquals(0, p5.size());
    }

    private void addTasks(Project p) {
        Task t1 = createTask(p, "T1", "2020-02-29");
        Task t2 = createTask(p, "T2", "2020-03-01");
        Task t3 = createTask(p, "T3", "2020-03-02");
        Task t4 = createTask(p, "T4", "2020-03-02");
        Task t5 = createTask(p, "T5", "2020-03-04");
        Task t6 = createTask(p, "T6", "2020-03-04");
        Task t7 = createTask(p, "T7", "2020-02-28");

        List<ProjectType> types = getTypes(ProjectType.TODO); // Added a task project type

        List<ProjectItems> projectItems = getProjectItems("2020-02-29",
                "2020-03-02",
                "America/Los_Angeles",
                types);

        assertEquals(3, projectItems.size());
        List<ProjectItems> p1 = projectItems.stream().filter(x -> x.getDate().equals(t1.getDueDate()))
                .collect(Collectors.toList());
        assertNotNull(p1);
        assertEquals(1, p1.size());
        assertEquals(1, p1.get(0).getTasks().size());
        Task t = p1.get(0).getTasks().get(0);
        assertEquals(t1, t);

        List<ProjectItems> p2 = projectItems.stream().filter(x -> x.getDate().equals(t2.getDueDate()))
                .collect(Collectors.toList());
        assertNotNull(p2);
        assertEquals(1, p2.size());
        assertEquals(1, p2.get(0).getTasks().size());
        t = p2.get(0).getTasks().get(0);
        assertEquals(t2, t);

        List<ProjectItems> p3 = projectItems.stream().filter(x -> x.getDate().equals(t3.getDueDate()))
                .collect(Collectors.toList());
        assertNotNull(p3);
        assertEquals(1, p3.size());
        assertEquals(2, p3.get(0).getTasks().size());

        List<ProjectItems> p4 = projectItems.stream().filter(x -> x.getDate().equals(t4.getDueDate()))
                .collect(Collectors.toList());
        assertNotNull(p3);
        assertEquals(1, p4.size());
        assertEquals(2, p4.get(0).getTasks().size());

        List<ProjectItems> p5 = projectItems.stream().filter(x -> x.getDate().equals(t5.getDueDate()))
                .collect(Collectors.toList());
        assertEquals(0, p5.size());
    }

    private Task addRecurringTasks(Project project) {
        String recurrenceRule = "DTSTART:20200420T070000Z RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20200520T070000Z";
        String taskName = "rt1";

        CreateTaskParams task = new CreateTaskParams(taskName, sampleUsers[0], null,
                null, null, null, TIMEZONE, recurrenceRule);
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

    private Transaction createTransaction(Project project, String name, String date) {
        CreateTransactionParams transaction =
                new CreateTransactionParams(name, sampleUsers[0], 1000.0,
                        date, null, TIMEZONE, 1);

        ResponseEntity<Transaction> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(transaction, sampleUsers[0]),
                Transaction.class,
                project.getId());
        Transaction created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    private Task createTask(Project project, String name, String date) {
        CreateTaskParams task =
                new CreateTaskParams(name, sampleUsers[0], date, null, 10,
                        null, TIMEZONE, null);

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

    private List<ProjectItems> getProjectItems(String startDate, String endDate, String timezone, List<ProjectType> types) {

        String url = ROOT_URL + randomServerPort + ProjectItemController.PROJECT_ITEMS_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("types", types)
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .queryParam("timezone", timezone);

        ResponseEntity<ProjectItems[]> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, sampleUsers[0]),
                ProjectItems[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        return Arrays.asList(response.getBody());
    }

    private Project createProject(String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, type, "d14", g.getId());

        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(project, sampleUsers[0]),
                Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(projectName, created.getName());
        assertEquals(sampleUsers[0], created.getOwner());
        assertEquals(type, created.getProjectType());
        assertEquals("Group_ProjectItem", created.getGroup().getName());
        assertEquals(sampleUsers[0], created.getGroup().getOwner());
        assertEquals("d14", created.getDescription());
        return created;
    }

    private Group createGroup() {
        CreateGroupParams group = new CreateGroupParams("Group_ProjectItem");

        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(group, sampleUsers[0]),
                Group.class);
        Group created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals("Group_ProjectItem", created.getName());
        assertEquals(sampleUsers[0], created.getOwner());

        return created;
    }

    private List<ProjectType> getTypes(ProjectType... types) {
        return new ArrayList<>(Arrays.asList(types));
    }

}
