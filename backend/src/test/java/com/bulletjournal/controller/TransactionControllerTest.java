package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.ledger.FrequencyType;
import com.bulletjournal.ledger.LedgerSummary;
import com.bulletjournal.ledger.LedgerSummaryType;
import com.bulletjournal.ledger.TransactionsSummary;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    private RequestParams requestParams;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }

    @Test
    public void testGetTransactions() throws Exception {
        Group group = TestHelpers.createGroup(requestParams, USER, "Group_ProjectItem");
        List<String> users = new ArrayList<>();
        users.add("BulletJournal");
        users.add("Thinker");
        users.add("ccc");
        users.add("Joker");
        int count = 1;
        for (String username : users) {
            group = TestHelpers.addUserToGroup(requestParams, group, username, ++count, USER);
        }

        Project p1 = TestHelpers.createProject(requestParams, USER, "p_Ledger_transaction", group, ProjectType.LEDGER);
        Transaction t1 = createTransaction(p1, "T1", "2019-12-01", "BulletJournal", 1000.0, 0);
        Transaction t2 = createTransaction(p1, "T2", "2019-12-13", "Thinker", 500.0, 1);
        Transaction t3 = createTransaction(p1, "T3", "2019-12-15", "ccc", 300.0, 0);
        Transaction t4 = createTransaction(p1, "T4", "2019-12-22", "Joker", 200.0, 1);
        Transaction t5 = createTransaction(p1, "T5", "2019-12-28", "ccc", 100.0, 0);

        // Get transactions by payer
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
        assertEquals(Double.valueOf("-500.0"), transactionsSummaries.get(2).getBalance());
        assertTrue(Math.abs(transactionsSummaries.get(0).getIncomePercentage() - 71) < 1e-4);
        assertEquals(Double.valueOf("-200.0"), transactionsSummaries.get(1).getBalance());

        List<Label> label = createLabels();
        // labels set is in reverse order ?
        t1 = setLabelsforTransaction(t1, label);
        t2 = setLabelsforTransaction(t2, label);
        t5 = setLabelsforTransaction(t5, label);

        // Get transactions by label
        url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE)
                .queryParam("frequencyType", FrequencyType.MONTHLY.name())
                .queryParam("timezone", TIMEZONE)
                .queryParam("ledgerSummaryType", LedgerSummaryType.LABEL.name())
                .queryParam("startDate", "2019-12-01")
                .queryParam("endDate", "2019-12-31")
                .buildAndExpand(p1.getId()).toUriString();
        transactionsResponse = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                LedgerSummary.class);
        summary = transactionsResponse.getBody();
        transactionsSummaries = summary.getTransactionsSummaries();
        assertEquals(5, summary.getTransactions().size());
        assertEquals("Label0", transactionsSummaries.get(0).getName());
        assertEquals("Label2", transactionsSummaries.get(2).getName());
        assertEquals((Double) 600.0, transactionsSummaries.get(1).getBalance());
        assertTrue(Math.abs(transactionsSummaries.get(0).getIncomePercentage() - 79) < 1e-4);
        assertTrue(Math.abs(transactionsSummaries.get(0).getExpensePercentage() - 71) < 1e-4);

        // get transactions default (MONTHLY)
        Transaction t6 = createTransaction(p1, "T6", "2019-11-28", "BulletJournal", 250.0, 1);
        Transaction t7 = createTransaction(p1, "T7", "2019-10-28", "999999", 700.0, 0);
        Transaction t8 = createTransaction(p1, "T8", "2019-09-28", "mqm", 300.0, 1);
        Transaction t9 = createTransaction(p1, "T9", "2019-09-18", "mqm", 100.0, 1);
        Transaction t10 = createTransaction(p1, "T10", "2018-09-28", "BulletJournal", 200.0, 0);
        Transaction t11 = createTransaction(p1, "T11", "2018-11-17", "ccc", 300.0, 0);

        url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE)
                .queryParam("frequencyType", FrequencyType.MONTHLY.name())
                .queryParam("timezone", TIMEZONE)
                .queryParam("ledgerSummaryType", LedgerSummaryType.DEFAULT.name())
                .queryParam("startDate", "2018-09-01")
                .queryParam("endDate", "2019-11-30")
                .buildAndExpand(p1.getId()).toUriString();
        transactionsResponse = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                LedgerSummary.class);
        summary = transactionsResponse.getBody();
        transactionsSummaries = summary.getTransactionsSummaries();
        assertTrue(Math.abs(summary.getBalance() - 550.0) < 1e-4);
        assertTrue(Math.abs(summary.getIncome() - 1200.0) < 1e-4);
        assertEquals(6, summary.getTransactions().size());
        assertEquals("2018 SEPTEMBER", transactionsSummaries.get(0).getName());
        assertEquals("2019 SEPTEMBER", transactionsSummaries.get(2).getName());
        assertEquals(Double.valueOf("-400.0"), transactionsSummaries.get(2).getBalance());
        assertTrue(Math.abs(transactionsSummaries.get(2).getExpensePercentage() - 62) < 1e-4);
        assertTrue(Math.abs(transactionsSummaries.get(0).getIncomePercentage() - 17) < 1e-4);
        assertEquals((Double) 0.0, transactionsSummaries.get(0).getExpensePercentage());

        // get transactions by default, yearly

        url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE)
                .queryParam("frequencyType", FrequencyType.YEARLY.name())
                .queryParam("timezone", TIMEZONE)
                .queryParam("ledgerSummaryType", LedgerSummaryType.DEFAULT.name())
                .queryParam("startDate", "2018-09-01")
                .queryParam("endDate", "2019-09-30")
                .buildAndExpand(p1.getId()).toUriString();
        transactionsResponse = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                LedgerSummary.class);
        summary = transactionsResponse.getBody();
        transactionsSummaries = summary.getTransactionsSummaries();
        assertEquals(4, summary.getTransactions().size());
        assertEquals("2018", transactionsSummaries.get(0).getName());
        assertEquals(Double.valueOf("-400.0"), transactionsSummaries.get(1).getBalance());
        assertTrue(Math.abs(transactionsSummaries.get(0).getIncomePercentage() - 100.0) < 1e-4);

        // get transactions by default, weekly
        url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE)
                .queryParam("frequencyType", FrequencyType.WEEKLY.name())
                .queryParam("timezone", TIMEZONE)
                .queryParam("ledgerSummaryType", LedgerSummaryType.DEFAULT.name())
                .queryParam("startDate", "2019-12-01")
                .queryParam("endDate", "2019-12-30")
                .buildAndExpand(p1.getId()).toUriString();
        transactionsResponse = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                LedgerSummary.class);
        summary = transactionsResponse.getBody();
        transactionsSummaries = summary.getTransactionsSummaries();
        assertEquals(5, summary.getTransactions().size());
        assertEquals("2019 DECEMBER Week 1", transactionsSummaries.get(0).getName());
        assertEquals("2019 DECEMBER Week 4", transactionsSummaries.get(3).getName());
        assertEquals(Double.valueOf("-100.0"), transactionsSummaries.get(3).getBalance());
        assertTrue(Math.abs(transactionsSummaries.get(0).getIncomePercentage() - 71) < 1e-4);
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
        assertEquals("hero", created.getOwner().getName());
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
        assertEquals("hero", created.getOwner().getName());
        assertEquals(type, created.getProjectType());
        assertEquals("Group_ProjectItem", created.getGroup().getName());
        assertEquals("hero", created.getGroup().getOwner().getName());
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

    private Transaction setLabelsforTransaction(Transaction t, List<Label> labels) {
        // Attach Labels to transactions
        ResponseEntity<Transaction> setLabelResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTION_SET_LABELS_ROUTE,
                HttpMethod.PUT,
                TestHelpers.actAsOtherUser(labels.stream().map(l -> l.getId()).collect(Collectors.toList()), USER),
                Transaction.class,
                t.getId());
        assertEquals(HttpStatus.OK, setLabelResponse.getStatusCode());
        t = setLabelResponse.getBody();
        assertEquals(labels.size(), t.getLabels().size());

        return t;
    }

    private List<Label> createLabels() {
        List<Label> labels = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            CreateLabelParams createLabelParams = new CreateLabelParams("Label" + i, "Icon" + i);
            ResponseEntity<Label> response = this.restTemplate.exchange(
                    ROOT_URL + randomServerPort + LabelController.LABELS_ROUTE,
                    HttpMethod.POST,
                    TestHelpers.actAsOtherUser(createLabelParams, USER),
                    Label.class);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            labels.add(response.getBody());
        }

        ResponseEntity<Label[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + LabelController.LABELS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                Label[].class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Label[] labelsCreated = response.getBody();
        assertEquals(5, labelsCreated.length);
        return labels;
    }


}