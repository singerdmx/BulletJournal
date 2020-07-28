package com.bulletjournal.controller;

import com.bulletjournal.controller.models.AddDeviceTokenParams;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.messaging.firebase.FcmClient;
import com.bulletjournal.messaging.firebase.FcmMessageParams;
import com.bulletjournal.messaging.mailjet.MailjetEmailClient;
import com.bulletjournal.messaging.mailjet.MailjetEmailParams;
import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.DeviceTokenRepository;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
import com.bulletjournal.repository.models.User;
import com.google.common.collect.Iterables;
import com.google.common.collect.Sets;
import com.mailjet.client.MailjetResponse;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.junit.*;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

/**
 * Tests {@link com.bulletjournal.controller.DeviceController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class DeviceControllerTest {


    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceControllerTest.class);

    private static final String USER1 = "fun_bam";

    private static final String USER2 = "Rongkai_Liu";

    private static final String ROOT_URL = "http://localhost:";

    private static final String EXAMPLE_TOKEN1 = "fZbt6xpGI_8:APA91bFs24liZn4wZgPMtGuL5KqvsJErwNCKB7sIm2Qd2FC4EdjjtCfStQoqzL-iGDomDHpv7sV8bdoCm_DTf9GuBmf5eZZBoNq2pYl_bNAJAPs6WK7zywg3TjHQ47mbtqJ7IaPkDSR5";

    private static final String EXAMPLE_TOKEN2 = "dZbt6xpGI_8:APA91bFs24liZn4wZgPMtGuL5KqvsJErwNCKB7sIm2Qd2FC4EdjjtCfStQoqzL-iGDomDHpv7sV8bdoCm_DTf9GuBmf5eZZBoNq2pYl_bNAJAPs6WK7zywg3TjHQ47mbtqJ7IaPkDSR5";

    @Autowired
    DeviceTokenDaoJpa deviceTokenDaoJpa;

    @Autowired
    DeviceTokenRepository deviceTokenRepository;

    @Autowired
    UserDaoJpa userDaoJpa;

    @Autowired
    FcmClient fcmClient;

    @Autowired
    MailjetEmailClient mailjetEmailClient;

    private User user1;

    private User user2;

    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        user1 = userDaoJpa.getByName(USER1);
        user2 = userDaoJpa.getByName(USER2);
    }

    @After
    public void tearDown() {
        deviceTokenDaoJpa.deleteAllTokens();
    }

    /**
     * Submit token1 for USER1, should have (token1, USER1) in DB
     * Submit same token1 for USER2, should have (token1, USER2) in DB
     * Submit token2 for USER2, should have (token1, USER2) (token2, USER2) in DB
     * Remove token1, should have only token2 in DB
     */
    @Test
    public void testAddDeleteToken() {
        ResponseEntity<String> response = submitToken(EXAMPLE_TOKEN1, USER1);
        Assert.assertEquals(DeviceController.CREATED_RESPONSE, response.getBody());
        DeviceToken deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN1);
        Assert.assertEquals(new DeviceToken(user1, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN1, USER1);
        Assert.assertEquals(DeviceController.EXISTED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN1);
        Assert.assertEquals(new DeviceToken(user1, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN1, USER2);
        Assert.assertEquals(DeviceController.REPLACED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN1);
        Assert.assertEquals(new DeviceToken(user2, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN2, USER2);
        Assert.assertEquals(DeviceController.CREATED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN2);
        Assert.assertEquals(new DeviceToken(user2, EXAMPLE_TOKEN2), deviceToken);
        Collection<DeviceToken> tokens = deviceTokenDaoJpa.getTokensByUser(USER2);
        Assert.assertTrue(
            tokens.containsAll(
                Arrays.asList(
                    new DeviceToken(user2, EXAMPLE_TOKEN1),
                    new DeviceToken(user2, EXAMPLE_TOKEN2))
            )
        );

        Assert.assertTrue(deviceTokenDaoJpa.deleteToken(EXAMPLE_TOKEN1));
        Assert.assertTrue(deviceTokenDaoJpa.getTokensByUser(USER1).isEmpty());
        Assert.assertEquals(
            Iterables.getOnlyElement(deviceTokenDaoJpa.getTokensByUser(USER2)).getToken(),
            EXAMPLE_TOKEN2);
    }

    /**
     * Submit token to have [token1, user1] [token2, user2] in DB
     * Batch get tokens for [user1, user2], should return [token1, token2]
     */
    @Test
    public void testBatchGetTokens() {
        ResponseEntity<String> response = submitToken(EXAMPLE_TOKEN1, USER1);
        Assert.assertEquals(DeviceController.CREATED_RESPONSE, response.getBody());
        DeviceToken deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN1);
        Assert.assertEquals(new DeviceToken(user1, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN2, USER2);
        Assert.assertEquals(DeviceController.CREATED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN2);
        Assert.assertEquals(new DeviceToken(user2, EXAMPLE_TOKEN2), deviceToken);
        List<DeviceToken> tokens
            = deviceTokenRepository.findDeviceTokensByUsers(Sets.newHashSet(USER1, USER2));
        Assert.assertEquals(2, tokens.size());
        Assert.assertTrue(
            tokens.stream().map(DeviceToken::getToken).collect(Collectors.toList())
                .containsAll(Arrays.asList(EXAMPLE_TOKEN1, EXAMPLE_TOKEN2)));
    }

    @Test
    @Ignore
    public void testFcm() throws Exception {
        String newToken = "cuIiWu-1TjiRomJNP8948o:APA91bEdx_G7MVKD3mYEwgeoOQJqS6KVxYdhJ1oE5ot0-AauTw30lzL_JQYbgDZ60HKFA2PeGzdnniXfaS-vIwAQHEMgWo6kDe7fb_D4X32jfAwlWfntdt8HHQE2ZcLilpMhQhJQpYwp";
        String oldToken = "fZbssspGI_8:APA91bFs24liZn4wZgPMtGuL5KqvsJErwNCKB7sIm2Qd2FC4EdjjtCfStQoqzL-iGDomDHpv7sV8bdoCm_DTf9GuBmf5eZZBoNq2pYl_bNAJAPs6WK7zywg3TjHQ47mbtqJ7IaPkDSR5";

        FcmMessageParams params = new FcmMessageParams(
            oldToken,
            "ExampleKey",
            "ExampleValue"
        );
        fcmClient.sendAllMessages(Arrays.asList(params));
        Thread.sleep(5000);
    }

    private ResponseEntity<String> submitToken(String token, String userName) {
        ResponseEntity<String> response
            = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + DeviceController.DEVICE_TOKEN_ROUTE,
            HttpMethod.POST,
            TestHelpers.actAsOtherUser(new AddDeviceTokenParams(token), userName),
            String.class
        );
        return response;
    }

    @Test
    @Ignore
    public void testEmail() throws Exception {
        MailjetEmailParams params = new MailjetEmailParams(
            Arrays.asList(new ImmutablePair<>("Will", "eg@gmail.com")),
            "TestSubject", "TestContentText");
        MailjetEmailParams params2 = new MailjetEmailParams(
            Arrays.asList(new ImmutablePair<>("Will2", "eg@gmail.com")),
            "TestSubject2", "TestContentText2");
        List<Future<MailjetResponse>> ret
            = mailjetEmailClient.sendAllEmailAsync(Arrays.asList(params, params2));
        LOGGER.info("reached here first");
        for (Future<MailjetResponse> future : ret) {
            MailjetResponse response = future.get();
            LOGGER.info("response: {}", response);
        }
    }
}
