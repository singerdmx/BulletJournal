package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.util.DeltaConverter;
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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

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
    private RequestParams requestParams;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }

    @Test
    public void testQuery() {
        Group group = TestHelpers.createGroup(requestParams, USER, "for_es_Group_ProjectItem");
        Project p1 = TestHelpers.createProject(requestParams, USER, "for_es_p_ProjectItem_Task", group, ProjectType.TODO);
        addTasks(p1);

        Project p2 = TestHelpers.createProject(requestParams, USER, "for_es_p_ProjectItem_Note", group, ProjectType.NOTE);
        addNotes(p2);

        Project p3 = TestHelpers.createProject(requestParams, USER, "for_es_p_ProjectItem_Ledger", group, ProjectType.LEDGER);
        addTransactions(p3);

    }

    private void addTransactions(Project p) {
        Transaction t1 = createTransaction(p, "for_es_T1", "2020-02-29");
        Transaction t2 = createTransaction(p, "for_es_T2", "2020-03-01");
        addTransactionContents(t1, DeltaConverter.generateDeltaContent("Buy some food"));
        addTransactionContents(t2, DeltaConverter.generateDeltaContent("Buy some book"));
    }

    Content addTransactionContents(Transaction transaction, String text) {
        CreateContentParams params = new CreateContentParams(text);
        ResponseEntity<Content> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.ADD_CONTENT_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, USER),
                Content.class,
                transaction.getId()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Content content = response.getBody();
        assertEquals(USER, content.getOwner().getName());
        assertEquals(DeltaConverter.supplementContentText(params.getText()), content.getText());
        assertNotNull(content.getId());
        return content;
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
        Note n1 = createNote(p, "for_es_n1", "2020-05-26");
        Note n2 = createNote(p, "for_es_n2", "2020-06-25");
        addNoteContents(n1, DeltaConverter.generateDeltaContent("don't forget homework"));
        addNoteContents(n2, DeltaConverter.generateDeltaContent("don't forget to go to class"));
    }

    private Content addNoteContents(Note note, String text) {
        CreateContentParams params = new CreateContentParams(text);
        ResponseEntity<Content> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.ADD_CONTENT_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(params, USER),
                Content.class,
                note.getId()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Content content = response.getBody();
        assertEquals(USER, content.getOwner().getName());
        assertEquals(DeltaConverter.supplementContentText(params.getText()), content.getText());
        assertNotNull(content.getId());
        return content;
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

    private void addTasks(Project p) {
        Task t1 = createTask(p, "hello world", "2020-02-29");
        Task t2 = createTask(p, "love", "2020-03-01");
        addTaskContents(t1, DeltaConverter.generateDeltaContent("hello world a test hello world work"));
        addTaskContents(t1, DeltaConverter.generateDeltaContent("I love you don't love me"));
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
                TestHelpers.actAsOtherUser(params, USER),
                Content.class,
                task.getId()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Content content = response.getBody();
        assertEquals(USER, content.getOwner().getName());
        assertEquals(DeltaConverter.supplementContentText(params.getText()), content.getText());
        assertNotNull(content.getId());
        return content;
    }
}
