package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.util.DeltaConverter;
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
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

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
    private static final String YESTERDAY = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    private static final String TOMORROW = LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    private static final String ROOT_URL = "http://localhost:";
    /**
     * test recent project item
     */
    private static final String USER_0518 = "0518";
    private static final String TIMEZONE = "America/Los_Angeles";
    private final String expectedOwner = "BulletJournal";
    private final String[] sampleUsers = {
            "Michael_Zhou",
            "Xavier"
    };
    private final TestRestTemplate restTemplate = new TestRestTemplate();
    @LocalServerPort
    int randomServerPort;
    private RequestParams requestParams;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }

    @After
    public void teardown() {

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
        Task t1 = createTask(p, "T1", "2020-02-29", null);
        Task t2 = createTask(p, "T2", "2020-03-01", null);
        Task t3 = createTask(p, "T3", "2020-03-02", null);
        Task t4 = createTask(p, "T4", "2020-03-02", null);
        Task t5 = createTask(p, "T5", "2020-03-04", null);
        Task t6 = createTask(p, "T6", "2020-03-04", null);
        Task t7 = createTask(p, "T7", "2020-02-28", null);
        Task t8 = createTask(p, "T8", "2020-07-24", "23:30");

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

        projectItems = getProjectItems("2020-07-23",
                "2020-07-26",
                "America/Los_Angeles",
                types);

        List<ProjectItems> p8 = projectItems.stream().filter(x -> x.getDate().equals(t8.getDueDate()))
                .collect(Collectors.toList());
        assertEquals(1, p8.size());
    }

    private Task addRecurringTasks(Project project) {
        String recurrenceRule = "DTSTART:20200420T070000Z RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20200520T070000Z";
        String taskName = "rt1";

        CreateTaskParams task = new CreateTaskParams(taskName, null,
                null, null, new ReminderSetting(), ImmutableList.of(sampleUsers[0]), TIMEZONE, recurrenceRule);
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
        assertEquals(TIMEZONE, createdTask.getTimezone());
        assertEquals(sampleUsers[0], createdTask.getAssignees().get(0).getName());
        assertEquals(recurrenceRule, createdTask.getRecurrenceRule());

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

    private Task createTask(Project project, String name, String date, String time) {
        CreateTaskParams task =
                new CreateTaskParams(name, date, time, 10,
                        new ReminderSetting(), ImmutableList.of(sampleUsers[0]), TIMEZONE, null);

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

    @Test
    public void testGetProjectItems() throws Exception {
        // Create default testing group
        Group group = TestHelpers.createGroup(requestParams, sampleUsers[0], "Group_ProjectItem");

        /*
         * Transaction:
         *     "2020-02-29"
         *     "2020-03-01"
         *     "2020-03-02"
         *     "2020-03-02"
         *     "2020-03-04"
         */
        Project p1 = TestHelpers.createProject(requestParams, sampleUsers[0], "p_ProjectItem_Ledger", group, ProjectType.LEDGER);
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
         *     "2020-07-24 23:30"
         */
        Project p2 = TestHelpers.createProject(requestParams, sampleUsers[0], "p_ProjectItem_Task", group, ProjectType.TODO);
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
        assertEquals("2020-03-04", projectItems.get(4).getDate());
        assertEquals(1, projectItems.get(4).getTransactions().size());
        assertEquals(2, projectItems.get(4).getTasks().size());
        assertEquals("2020-03-02", projectItems.get(3).getDate());
        assertEquals(2, projectItems.get(3).getTransactions().size());
        assertEquals(2, projectItems.get(3).getTasks().size());
        assertEquals("2020-03-01", projectItems.get(2).getDate());
        assertEquals(1, projectItems.get(2).getTransactions().size());
        assertEquals(1, projectItems.get(2).getTasks().size());
        assertEquals("2020-02-29", projectItems.get(1).getDate());
        assertEquals(1, projectItems.get(1).getTransactions().size());
        assertEquals(1, projectItems.get(1).getTasks().size());
        assertEquals("2020-02-28", projectItems.get(0).getDate());
        assertEquals(0, projectItems.get(0).getTransactions().size());
        assertEquals(1, projectItems.get(0).getTasks().size());

        /*
         * "2020-07-24 23:30" American/Los_Angeles -> "2020-07-25 00:30" American/Chicago
         */
        List<ProjectItems> projectItemsInDifferentTimezone = getProjectItems("2020-07-25",
                "2020-07-25",
                "America/Chicago",
                types);
        assertNotNull(projectItemsInDifferentTimezone);
        assertEquals(1, projectItemsInDifferentTimezone.get(0).getTasks().size());

        /*
         * No project item for other user
         */
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
        boolean contains = false;
        for (Task rct : projectItemsRecurring.get(0).getTasks()) {
            if (rct.getName().equals("rt1")) {
                contains = true;
                break;
            }
        }
        assertTrue(contains);
        //assertEquals("rt1", projectItemsRecurring.get(0).getTasks().get(0).getName());
        contains = false;
        for (Task rct : projectItemsRecurring.get(1).getTasks()) {
            if (rct.getName().equals("rt1")) {
                contains = true;
                break;
            }
        }
        assertTrue(contains);
        //assertEquals("rt1", projectItemsRecurring.get(1).getTasks().get(0).getName());
        assertEquals("2020-04-27", projectItemsRecurring.get(1).getTasks().get(0).getDueDate());
        assertEquals("2020-04-20", projectItemsRecurring.get(0).getTasks().get(0).getDueDate());

        deleteTask(recurTask);
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

    private Project createRecentProject(String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, type, "RecentItemTest", g.getId());
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
        assertEquals("RecentItemTest", created.getDescription());
        return created;
    }

    private void addRecentTasks(Project p) {
        List<Long> labels = new ArrayList<>();
        createRecentTaskLabels().stream().forEach(label -> labels.add(label.getId()));
        Task t1 = createRecentTask(p, "T1", "2020-05-28", labels);
        Task t2 = createRecentTask(p, "T2", "2020-05-29", labels);
        addRecentTaskContents(t1, DeltaConverter.generateDeltaContent("a"));
        addRecentTaskContents(t1, DeltaConverter.generateDeltaContent("b"));

        List<ProjectType> types = getTypes(ProjectType.TODO); // Added a task project type
        List<LinkedHashMap> projectItems = getRecentProjectItems(
                YESTERDAY,
                TOMORROW,
                "America/Los_Angeles",
                types);


        assertNotNull(projectItems);
        assertEquals(2, projectItems.size());
        assertEquals(t1.getId().intValue(), projectItems.get(0).get("id"));
        assertEquals(t2.getId().intValue(), projectItems.get(1).get("id"));

        // test label value and icon
        List<LinkedHashMap> labelList = (ArrayList) projectItems.get(0).get("labels");
        assertNotNull(labelList);
        assertEquals(2, labelList.size());
        assertEquals(t1.getLabels().get(0).getId().intValue(), labelList.get(0).get("id"));
        assertEquals("TagOutlined", labelList.get(0).get("icon").toString());
        assertEquals("Label0", labelList.get(0).get("value").toString());
        assertEquals(t2.getId().intValue(), projectItems.get(1).get("id"));
    }

    private void addRecentNotes(Project p) {
        Note n1 = createRecentNote(p, "N1", "2020-05-26");

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
        assertEquals(DeltaConverter.supplementContentText(params.getText()), content.getText());
        assertNotNull(content.getId());
        return content;
    }

    private Task createRecentTask(Project project, String name, String date, List<Long> labels) {
        CreateTaskParams task =
                new CreateTaskParams(name, date, null, 10,
                        new ReminderSetting(), ImmutableList.of(USER_0518), TIMEZONE, null, labels);

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

    private List<Label> createRecentTaskLabels() {
        List<Label> labels = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            CreateLabelParams createLabelParams =
                    new CreateLabelParams("Label" + i, "TagOutlined");
            ResponseEntity<Label> response = this.restTemplate.exchange(
                    ROOT_URL + randomServerPort + LabelController.LABELS_ROUTE,
                    HttpMethod.POST,
                    TestHelpers.actAsOtherUser(createLabelParams, USER_0518),
                    Label.class);

            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            labels.add(response.getBody());
        }

        ResponseEntity<Label[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + LabelController.LABELS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER_0518),
                Label[].class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Label[] labelsCreated = response.getBody();
        assertEquals(2, labelsCreated.length);
        return labels;
    }

    private void addRecentTransactions(Project p) {
        Transaction tr1 = createRecentTransaction(p, "Tr1", "2020-05-29");

        List<ProjectType> types = getTypes(ProjectType.LEDGER); // Added a task project type
        List<LinkedHashMap> projectItems = getRecentProjectItems(
                YESTERDAY,
                TOMORROW,
                "America/Los_Angeles",
                types);

        assertNotNull(projectItems);
        assertEquals(1, projectItems.size());
        assertEquals(tr1.getContentType().toString(), projectItems.get(0).get("contentType").toString());
    }

    private Transaction createRecentTransaction(Project project, String name, String date) {
        CreateTransactionParams transaction =
                new CreateTransactionParams(name, USER_0518, 1000.0,
                        date, null, TIMEZONE, 1);

        ResponseEntity<Transaction> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(transaction, USER_0518),
                Transaction.class,
                project.getId());
        Transaction created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    private Note createRecentNote(Project project, String name, String date) {
        CreateNoteParams note = new CreateNoteParams(name);
        ResponseEntity<Note> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.NOTES_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(note, USER_0518),
                Note.class,
                project.getId());
        Note created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }

    @Test
    public void testGetRecentProjectItems() throws Exception {
        // Create default testing group
        //Group group = createGroup(USER_0518);
        Group group = TestHelpers.createGroup(requestParams, USER_0518, "Group_ProjectItem");

        Project p1 = createRecentProject("p_RecentProjectItem_Task", group, ProjectType.TODO);
        addRecentTasks(p1);

        Project p2 = createRecentProject("p_ProjectItem_Ledger", group, ProjectType.LEDGER);
        addRecentTransactions(p2);

        Project p3 = createRecentProject("p_ProjectItem_Note", group, ProjectType.NOTE);
        addRecentNotes(p3);

        List<ProjectType> types = getTypes(ProjectType.TODO, ProjectType.LEDGER, ProjectType.NOTE);

        List<LinkedHashMap> projectItems = getRecentProjectItems(
                YESTERDAY,
                TOMORROW,
                "America/Los_Angeles",
                types);

        assertNotNull(projectItems);
        assertEquals(4, projectItems.size());
        assertEquals(p3.getId().intValue(), projectItems.get(0).get("projectId"));
        assertEquals(p2.getId().intValue(), projectItems.get(1).get("projectId"));
        assertEquals(p1.getId().intValue(), projectItems.get(2).get("projectId"));
        assertEquals(p1.getId().intValue(), projectItems.get(3).get("projectId"));
    }
}
