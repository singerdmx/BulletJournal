package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.google.common.collect.ImmutableList;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class QueryControllerTest {

    private static final String YESTERDAY = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    private static final String TOMORROW = LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    private static final String ROOT_URL = "http://localhost:";

    private static final String USER = "bbs1024";
    private static String TIMEZONE = "America/Los_Angeles";
    private static final String USER_0518 = "0518";
    private final String[] sampleUsers = {
            "Michael_Zhou",
            "Xavier",
            "BulletJournal"
    };

    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testQuery() {
        Group group = createGroup(sampleUsers[0]);
        Project p1 = createProject("p_ProjectItem_Task", group, ProjectType.TODO);
        addTasks(p1);

        Project p2 = createProject("p_ProjectItem_Note", group, ProjectType.NOTE);
        addRecentNotes(p2);

        Project p3 = createProject("p_ProjectItem_Ledger", group, ProjectType.LEDGER);
        addTransactions(p3);

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

    private void addRecentNotes(Project p) {
        Note n1 = createRecentNote(p, "n1", "2020-05-26");
        //Note n2 = createRecentNote(p, "n2", "2020-05-26");

        List<ProjectType> types = getTypes(ProjectType.NOTE); // Added a task project type
        List<LinkedHashMap> projectItems = getRecentProjectItems(
                YESTERDAY,
                TOMORROW,
                "America/Los_Angeles",
                types);

        assertNotNull(projectItems);
        assertEquals(1, projectItems.size());
        assertEquals(n1.getId().intValue(), projectItems.get(0).get("id"));
    }

    private List<ProjectType> getTypes(ProjectType... types) {
        return new ArrayList<>(Arrays.asList(types));
    }

    private List<LinkedHashMap> getRecentProjectItems(String startDate, String endDate, String timezone, List<ProjectType> types) {
        String url = ROOT_URL + randomServerPort + ProjectItemController.RECENT_ITEMS_ROUTE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("types", types)
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .queryParam("timezone", timezone);

        ResponseEntity<LinkedHashMap[]> response = this.restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER_0518),
                LinkedHashMap[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        return Arrays.asList(response.getBody());
    }


    private Note createRecentNote(Project project, String name, String date) {
        CreateNoteParams note = new CreateNoteParams(name);
        ResponseEntity<Note> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.NOTES_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(note, sampleUsers[0]),
                Note.class,
                project.getId());
        Note created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
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
        assertEquals(sampleUsers[0], created.getOwner().getName());
        assertEquals(type, created.getProjectType());
        assertEquals("Group_ProjectItem", created.getGroup().getName());
        assertEquals(sampleUsers[0], created.getGroup().getOwner().getName());
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
        addTaskContents(t1, "hello world a test hello worold work");
        addTaskContents(t2, "I love you don't love me");
    }

    private Task createTask(Project project, String name, String date) {
        CreateTaskParams task =
                new CreateTaskParams(name, date, null, 10,
                        new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null);

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

    private Content addTaskContents(Task task, String text) {
        CreateContentParams params = new CreateContentParams(text);
        ResponseEntity<Content> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.ADD_CONTENT_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, sampleUsers[0]),
                Content.class,
                task.getId()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Content content = response.getBody();
        assertEquals(sampleUsers[0], content.getOwner().getName());
        assertEquals(params.getText(), content.getText());
        assertNotNull(content.getId());
        return content;
    }
}
