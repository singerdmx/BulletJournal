package com.bulletjournal.controller;

import com.bulletjournal.controller.models.ChangeAliasParams;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.repository.UserDaoJpa;
import com.google.common.collect.Sets;
import org.junit.Assert;
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

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    UserDaoJpa userDaoJpa;

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

    @Test
    public void testGetUsersByNames() {
        List<com.bulletjournal.repository.models.User> users
            = userDaoJpa.getUsersByNames(Sets.newHashSet("Xavier", "xlf"));
        List<String> usernames = users.stream().map(com.bulletjournal.repository.models.User::getName).collect(Collectors.toList());
        Assert.assertEquals(2, usernames.size());
        Assert.assertTrue(usernames.containsAll(Arrays.asList("Xavier", "xlf")));
    }
}