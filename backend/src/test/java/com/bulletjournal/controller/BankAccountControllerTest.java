package com.bulletjournal.controller;

import com.bulletjournal.controller.models.BankAccount;
import com.bulletjournal.controller.models.params.CreateBankAccountParams;
import com.bulletjournal.controller.models.RequestParams;
import com.bulletjournal.controller.models.params.UpdateBankAccountParams;
import com.bulletjournal.ledger.BankAccountType;
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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * Tests {@link BankAccountController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class BankAccountControllerTest {

    private static final String USER = "BulletJournal";

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
    public void testCRUD() throws Exception {
        BankAccount acc1 = createBankAccount("account1", "38464925", null, BankAccountType.CHECKING_ACCOUNT);
        BankAccount acc2 = createBankAccount("account2", "38176396", null, BankAccountType.SAVING_ACCOUNT);
        testGetBankAccounts(8);
        acc1 = testUpdateBankAccount(acc1.getId(), "acc3");
        testDeleteBankAccount(acc2.getId());
        testGetBankAccounts(7);

    }

    private BankAccount createBankAccount(String name, String number, String description, BankAccountType type) {
        CreateBankAccountParams accountParams =
                new CreateBankAccountParams(name, number,
                        description, type);

        ResponseEntity<BankAccount> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BankAccountController.BANK_ACCOUNTS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(accountParams),
                BankAccount.class);
        BankAccount created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(number, created.getAccountNumber());
        assertEquals(USER, created.getOwner().getName());
        return created;
    }

    public void testGetBankAccounts(int expected) {
        ResponseEntity<BankAccount[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BankAccountController.BANK_ACCOUNTS_ROUTE,
                HttpMethod.GET,
                null,
                BankAccount[].class);
        BankAccount[] created = response.getBody();
        assert created != null;
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, created.length);
    }

    private BankAccount testUpdateBankAccount(long bankAccountId, String name) {
        UpdateBankAccountParams updateBankAccountParams = new UpdateBankAccountParams();
        updateBankAccountParams.setAccountType(BankAccountType.CREDIT_CARD);
        updateBankAccountParams.setName(name);
        ResponseEntity<BankAccount> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BankAccountController.BANK_ACCOUNT_ROUTE,
                HttpMethod.PUT,
                new HttpEntity<>(updateBankAccountParams),
                BankAccount.class,
                bankAccountId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        BankAccount updated = response.getBody();
        assert updated != null;
        assertEquals("acc3", updated.getName());
        return updated;
    }

    private void testDeleteBankAccount(long bankAccountId) {
        ResponseEntity<?> deleteResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BankAccountController.BANK_ACCOUNT_ROUTE,
                HttpMethod.DELETE,
                null,
                Void.class,
                bankAccountId);
        assertEquals(HttpStatus.OK, deleteResponse.getStatusCode());
    }
}
