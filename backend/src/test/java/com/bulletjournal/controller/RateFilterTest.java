package com.bulletjournal.controller;

import com.bulletjournal.config.RateConfig;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.filters.rate.limiting.TokenBucket;
import com.bulletjournal.redis.models.LockedUser;
import com.bulletjournal.redis.RedisLockedUserRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class RateFilterTest {

    private static final String USER = "BulletJournal";

    private static final String ROOT_URL = "http://localhost:";

    private static String TIMEZONE = "America/Los_Angeles";

    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();
    private RequestParams requestParams;

    @Autowired
    private RateConfig rateConfig;

    @Autowired
    private RedisLockedUserRepository redisLockedUserRepository;

    @Autowired
    TokenBucket tokenBucket;

    @Before
    public void setup() {
        this.rateConfig.setUser(2);
        clearLockedCache();
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        tokenBucket.clearBucket();
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }

    private void clearLockedCache() {
        Optional<LockedUser> lockedUserOptional = this.redisLockedUserRepository.findById(USER);
        if (lockedUserOptional.isPresent()) {
            this.redisLockedUserRepository.delete(lockedUserOptional.get());
        }
    }

    @After
    public void tearDown() {
        this.rateConfig.setUser(250);
        clearLockedCache();
        tokenBucket.clearBucket();
    }

    @Test
    public void testRateFilter() throws Exception {
        Group group = TestHelpers.createGroup(requestParams, USER, "testfilter");


        Project p1 = TestHelpers.createProject(requestParams, USER, "p_Ledger_transaction", group, ProjectType.LEDGER);

        // assumes this runs within the same minute as last request
        ResponseEntity<Transaction> t1 = createTransaction(p1, "T1", "2019-12-01", "hero", 1000.0, 0);
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, t1.getStatusCode());
        assertNull(t1.getBody());

        // user locked for 5 minutes
        t1 = createTransaction(p1, "T1", "2019-12-01", "hero", 1000.0, 0);
        assertEquals(HttpStatus.UNAUTHORIZED, t1.getStatusCode());

        t1 = createTransaction(p1, "T1", "2019-12-01", "hero", 1000.0, 0);
        assertEquals(HttpStatus.UNAUTHORIZED, t1.getStatusCode());

    }

    private ResponseEntity<Transaction> createTransaction(Project project, String name, String date, String payer, double amount, Integer type) {
        CreateTransactionParams transaction =
                new CreateTransactionParams(name, payer, amount,
                        date, null, TIMEZONE, type);

        ResponseEntity<Transaction> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TransactionController.TRANSACTIONS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(transaction, USER),
                Transaction.class,
                project.getId());

        return response;
    }
}
