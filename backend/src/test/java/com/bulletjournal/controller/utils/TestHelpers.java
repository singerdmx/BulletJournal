package com.bulletjournal.controller.utils;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.GroupController;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.ledger.TransactionType;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.Transaction;
import com.google.common.collect.ImmutableList;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

public class TestHelpers {
    private static TestRestTemplate restTemplate = new TestRestTemplate();
    @LocalServerPort
    private int randomServerPort;
    private static final String ROOT_URL = "http://localhost:";
    private static String TIMEZONE = "America/Los_Angeles";
    private static int randomPort = 8080;

    @SafeVarargs
    public static <T> void assertIfContains(List<T> container, T... objects) {
        for (T object : objects) {
            assertTrue(container.contains(object));
        }
    }

    @SafeVarargs
    public static <T> void assertIfNotContains(List<T> container, T... objects) {
        for (T object : objects) {
            assertFalse(container.contains(object));
        }
    }

    public static <T> HttpEntity actAsOtherUser(T body, String username, String... eTags) {
        final HttpHeaders headers = new HttpHeaders();
        headers.set(UserClient.USER_NAME_KEY, username);

        if (eTags.length > 0)
            headers.setIfNoneMatch(eTags[0]);

        if (body == null) {
            return new HttpEntity<>(headers);
        }

        return new HttpEntity<>(body, headers);
    }

    public static Task getTaskRepoModel(Long id,
                                        String assignee,
                                        String dueDate,
                                        String dueTime,
                                        String timezone,
                                        String name,
                                        Integer duration,
                                        Project project,
                                        List<Long> labels,
                                        ReminderSetting reminderSetting) {
        Task task = new Task();
        task.setId(id);
        task.setAssignees(ImmutableList.of(assignee));
        task.setDueDate(dueDate);
        task.setDueTime(dueTime);
        task.setTimezone(timezone);
        task.setName(name);
        task.setDuration(duration);
        task.setProject(project);
        task.setLabels(labels);
        task.setReminderSetting(reminderSetting);
        task.setCreatedAt(Timestamp.from(Instant.now()));
        task.setUpdatedAt(Timestamp.from(Instant.now()));
        return task;
    }


    public static Transaction getTransactionRepoModel(Long id,
                                                      String name,
                                                      Project project,
                                                      String payer,
                                                      Double amount,
                                                      String date,
                                                      String time,
                                                      String timezone,
                                                      Integer transactionType) {
        Transaction transaction = new Transaction();
        transaction.setId(id);
        transaction.setName(name);
        transaction.setProject(project);
        transaction.setPayer(payer);
        transaction.setAmount(amount);
        transaction.setDate(date);
        transaction.setTime(time);
        transaction.setTimezone(timezone);
        transaction.setTransactionType(TransactionType.getType(transactionType));
        transaction.setCreatedAt(Timestamp.from(Instant.now()));
        transaction.setUpdatedAt(Timestamp.from(Instant.now()));
        return transaction;
    }

    public static Group createGroup(RequestParams requestParams, String user, String groupName) {
        CreateGroupParams group = new CreateGroupParams(groupName);
        ResponseEntity<Group> response = requestParams.getRestTemplate().exchange(
                ROOT_URL + requestParams.getRandomServerPort() + "/api/groups",
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(group, user),
                Group.class);
        Group created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(groupName, created.getName());
        assertEquals(user, created.getOwner().getName());

        return created;
    }

    public static com.bulletjournal.controller.models.Project createProject(
            RequestParams requestParams, String user, String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, type, "d15", g.getId());

        ResponseEntity<com.bulletjournal.controller.models.Project> response = requestParams.getRestTemplate().exchange(
                ROOT_URL + requestParams.getRandomServerPort() + "/api/projects",
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(project, user),
                com.bulletjournal.controller.models.Project.class);
        com.bulletjournal.controller.models.Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(projectName, created.getName());
        assertEquals(user, created.getOwner().getName());
        assertEquals(type, created.getProjectType());
        assertEquals(user, created.getGroup().getOwner().getName());
        assertEquals("d15", created.getDescription());
        return created;
    }

    public static Group addUserToGroup(
            RequestParams requestParams, Group group, String username, int expectedSize, String requester) {
        AddUserGroupParams addUserGroupParams = new AddUserGroupParams(group.getId(), username);
        ResponseEntity<Group> groupsResponse = requestParams.getRestTemplate().exchange(
                ROOT_URL + requestParams.getRandomServerPort() + GroupController.ADD_USER_GROUP_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(addUserGroupParams, requester),
                Group.class);
        Group updated = groupsResponse.getBody();
        assertEquals(expectedSize, updated.getUsers().size());
        return updated;
    }
}
