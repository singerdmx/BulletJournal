package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
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

import javax.validation.constraints.AssertTrue;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;


/**
 * Tests {@link TransactionController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TransactionControllerTest {

    private static final String USER = "hero";

    private static final String ROOT_URL = "http://localhost:";

    private static String TIMEZONE = "America/Los_Angeles";


    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testGetTransactions() throws Exception {
        // Get Groups => use first group
        // Create Project
        // Create Transactions
        // Get Transactions


        Group group = createGroup();
        List<String> users = new ArrayList<>();
        users.add("BulletJournal");
        users.add("Thinker");
        users.add("ccc");
        users.add("Joker");
        int count = 1;
        for (String username : users) {
            group = addUserToGroup(group, username, ++count);
        }

        Project p1 = createProject("p_Ledger_transaction", group, ProjectType.LEDGER);
        // add more users to projects
        // create transactions in same months
        // TransactionType : 0 : income : 1 : expense
        Transaction t1 = createTransaction(p1, "T1", "2019-12-01", "BulletJournal", 1000.0, 0);
        Transaction t2 = createTransaction(p1, "T2", "2019-12-13", "Thinker", 500.0, 1);
        Transaction t3 = createTransaction(p1, "T3", "2019-12-15", "ccc", 300.0, 0);
        Transaction t4 = createTransaction(p1, "T4", "2019-12-22", "Joker", 200.0, 1);
        Transaction t5 = createTransaction(p1, "T5", "2019-12-28", "ccc", 100.0, 0);

        // Get transactions
        String url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE)
                .queryParam("frequencyType", FrequencyType.MONTHLY.name())
                .queryParam("timezone", TIMEZONE)
                .queryParam("ledgerSummaryType", LedgerSummaryType.PAYER.name())
                .queryParam("startDate", "2019-12-01")
                .queryParam("endDate", "2019-12-31")
                .buildAndExpand(p1.getId()).toUriString();
        ResponseEntity<LedgerSummary> transactionsResponse = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                LedgerSummary.class);

        List<Transaction> transactions = transactionsResponse.getBody().getTransactions();
        LedgerSummary summary = transactionsResponse.getBody();
        List<TransactionsSummary> transactionsSummaries = summary.getTransactionsSummaries();
        assertEquals("BulletJournal", transactionsSummaries.get(0).getName());
        assertTrue(Math.abs(summary.getBalance() - 700.0) < 1e-4);
        assertTrue(Math.abs(summary.getIncome() - 1400.0) < 1e-4);
        assertEquals(5, summary.getTransactions().size());
        assertEquals((Double) 400.0, transactionsSummaries.get(2).getBalance());
        assertTrue(Math.abs(transactionsSummaries.get(0).getIncomePercentage() - 71.43) < 1e-4);
        assertEquals(Double.valueOf("-500.0"), transactionsSummaries.get(1).getBalance());

    }

    private Group createGroup() {
        CreateGroupParams group = new CreateGroupParams("Group_ProjectItem");

        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(group, USER),
                Group.class);
        Group created = response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals("Group_ProjectItem", created.getName());
        assertEquals("hero", created.getOwner());
//        assertEquals(1, created.getUsers().size());

        return created;
    }

    private Project createProject(String projectName, Group g, ProjectType type) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, type, "d14", g.getId());

        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(project, USER),
                Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(projectName, created.getName());
        assertEquals("hero", created.getOwner());
        assertEquals(type, created.getProjectType());
        assertEquals("Group_ProjectItem", created.getGroup().getName());
        assertEquals("hero", created.getGroup().getOwner());
        assertEquals("d14", created.getDescription());
        return created;
    }

    private List<GroupsWithOwner> addUsersToGroup(final Group group, List<String> usernames) {
        AddUserGroupsParams addUserGroupsParams = new AddUserGroupsParams();
        for (String username : usernames) {
            addUserGroupsParams.getUserGroups().add(new AddUserGroupParams(group.getId(), username));
        }
        ResponseEntity<GroupsWithOwner[]> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.ADD_USER_GROUPS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(new HttpEntity<>(addUserGroupsParams), USER),
                GroupsWithOwner[].class);
        List<GroupsWithOwner> groups = Arrays.asList(groupsResponse.getBody());
        Group updated = groups.stream().filter(g -> group.getOwner().equals(g.getOwner()))
                .findFirst().get().getGroups()
                .stream().filter(g -> group.getName().equals(g.getName())).findFirst().get();
        assertEquals(usernames.size() + 1, updated.getUsers().size());
        return groups;
    }

    private Group addUserToGroup(Group group, String username, int expectedSize) {
        AddUserGroupParams addUserGroupParams = new AddUserGroupParams(group.getId(), username);
        ResponseEntity<Group> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.ADD_USER_GROUP_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(addUserGroupParams, USER),
                Group.class);
        Group updated = groupsResponse.getBody();
        assertEquals(expectedSize, updated.getUsers().size());
        return updated;
    }

    private Transaction createTransaction(Project project, String name, String date, String payer, double amount, Integer type) {
        CreateTransactionParams transaction =
                new CreateTransactionParams(name, payer, amount,
                        date, null, TIMEZONE, type);

        ResponseEntity<Transaction> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(transaction, USER),
                Transaction.class,
                project.getId());
        Transaction created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }


}