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
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class QueryControllerTest {

    private static final String ROOT_URL = "http://localhost:";

    private static final String USER = "bbs1024";
    private static String TIMEZONE = "America/Los_Angeles";

    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testQuery() {
        Group group = createGroup(USER);
        Project p1 = createProject("for_es_p_ProjectItem_Task", group, ProjectType.TODO);
        addTasks(p1);

        Project p2 = createProject("for_es_p_ProjectItem_Note", group, ProjectType.NOTE);
        addNotes(p2);

        Project p3 = createProject("for_es_p_ProjectItem_Ledger", group, ProjectType.LEDGER);
        addTransactions(p3);

    }

    private void addTransactions(Project p) {
        createTransaction(p, "for_es_T1", "2020-02-29");
        createTransaction(p, "for_es_T2", "2020-03-01");
        createTransaction(p, "for_es_T3", "2020-03-02");
        createTransaction(p, "for_es_T4", "2020-03-02");
        createTransaction(p, "for_es_T5", "2020-03-04");
    }

    private Transaction createTransaction(Project project, String name, String date) {
        CreateTransactionParams transaction =
                new CreateTransactionParams(name, USER, 1000.0,
                        date, null, TIMEZONE, 1);

        ResponseEntity<Transaction> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(transaction, USER),
                Transaction.class,
                project.getId());
        Transaction created = response.getBody();
        return created;
    }

    private void addNotes(Project p) {
        createNote(p, "for_es_n1", "2020-05-26");
    }

    private Note createNote(Project project, String name, String date) {
        CreateNoteParams note = new CreateNoteParams(name);
        ResponseEntity<Note> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.NOTES_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(note, USER),
                Note.class,
                project.getId());
        Note created = response.getBody();
        return created;
    }

    private Project createProject(String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, type, "for_es_d14", g.getId());

        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(project, USER),
                Project.class);
        Project created = response.getBody();
        return created;
    }

    private Group createGroup(String user) {
        CreateGroupParams group = new CreateGroupParams("for_es_Group_ProjectItem");

        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(group, user),
                Group.class);
        Group created = response.getBody();

        return created;
    }

    private void addTasks(Project p) {
        Task t1 = createTask(p, "for es hello world", "2020-02-29");
        Task t2 = createTask(p, "for es love", "2020-03-01");
        addTaskContents(t1, "for es hello world a test hello worold work");
        addTaskContents(t2, "for es I love you don't love me");
    }

    private Task createTask(Project project, String name, String date) {
        CreateTaskParams task =
                new CreateTaskParams(name, date, null, 10,
                        new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null);

        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(task, USER),
                Task.class,
                project.getId());

        Task created = response.getBody();
        return created;
    }

    private Content addTaskContents(Task task, String text) {
        CreateContentParams params = new CreateContentParams(text);
        ResponseEntity<Content> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.ADD_CONTENT_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, USER),
                Content.class,
                task.getId()
        );

        Content content = response.getBody();
        return content;
    }
}
