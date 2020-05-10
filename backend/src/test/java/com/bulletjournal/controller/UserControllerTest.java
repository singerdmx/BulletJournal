package com.bulletjournal.controller;

import com.bulletjournal.controller.models.ChangeAliasParams;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.controller.utils.TestHelpers;
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


/**
 * Tests {@link UserController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerTest {

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
    public void testChangeAlias() throws Exception {
        ChangeAliasParams changeAliasParams = new ChangeAliasParams("X");

        ResponseEntity<?> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + UserController.CHANGE_ALIAS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(changeAliasParams, USER),
                Void.class,
                "Xavier");

        assertEquals(HttpStatus.OK, response.getStatusCode());

        ResponseEntity<User> getUserResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + UserController.GET_USER_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                User.class,
                "Xavier");

        User user = getUserResponse.getBody();
        assertEquals("Xavier", user.getName());
        assertEquals("X", user.getAlias());

        getUserResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + UserController.GET_USER_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                User.class,
                "xlf");

        user = getUserResponse.getBody();
        assertEquals("xlf", user.getName());
        assertEquals("xlf", user.getAlias());
    }

}