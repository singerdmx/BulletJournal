package com.bulletjournal.controller;

import com.bulletjournal.controller.models.AddDeviceTokenParams;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.messaging.MessagingService;
import com.bulletjournal.messaging.firebase.FcmClient;
import com.bulletjournal.messaging.firebase.FcmMessageParams;
import com.bulletjournal.messaging.mailjet.MailjetEmailClient;
import com.bulletjournal.messaging.mailjet.MailjetEmailParams;
import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.DeviceTokenRepository;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
import com.google.common.collect.Iterables;
import com.google.common.collect.Sets;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.json.JSONArray;
import org.json.JSONObject;
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

    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
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
        Assert.assertEquals(new DeviceToken(USER1, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN1, USER1);
        Assert.assertEquals(DeviceController.EXISTED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN1);
        Assert.assertEquals(new DeviceToken(USER1, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN1, USER2);
        Assert.assertEquals(DeviceController.REPLACED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN1);
        Assert.assertEquals(new DeviceToken(USER2, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN2, USER2);
        Assert.assertEquals(DeviceController.CREATED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN2);
        Assert.assertEquals(new DeviceToken(USER2, EXAMPLE_TOKEN2), deviceToken);
        Collection<DeviceToken> tokens = deviceTokenDaoJpa.getTokensByUser(USER2);
        Assert.assertTrue(
            tokens.containsAll(
                Arrays.asList(
                    new DeviceToken(USER2, EXAMPLE_TOKEN1),
                    new DeviceToken(USER2, EXAMPLE_TOKEN2))
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
        Assert.assertEquals(new DeviceToken(USER1, EXAMPLE_TOKEN1), deviceToken);

        response = submitToken(EXAMPLE_TOKEN2, USER2);
        Assert.assertEquals(DeviceController.CREATED_RESPONSE, response.getBody());
        deviceToken = deviceTokenDaoJpa.get(EXAMPLE_TOKEN2);
        Assert.assertEquals(new DeviceToken(USER2, EXAMPLE_TOKEN2), deviceToken);
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
        fcmClient.sendAllMessagesAsync(Arrays.asList(params));
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
    public void sendEmail() throws Exception {
        JSONArray assigneeInfoList = new JSONArray();
        JSONObject info1 = new JSONObject();
        info1.put(MessagingService.ALIAS_PROPERTY, "will");
        info1.put(MessagingService.AVATAR_PROPERTY, "avatar_url_1");
        assigneeInfoList.put(info1);
        JSONObject info2 = new JSONObject();
        info2.put(MessagingService.ALIAS_PROPERTY, "will2");
        info2.put(MessagingService.AVATAR_PROPERTY, "avatar_url_2");
        assigneeInfoList.put(info2);
        JSONObject info3 = new JSONObject();
        info3.put(MessagingService.ALIAS_PROPERTY, "will3");
        info3.put(MessagingService.AVATAR_PROPERTY, "avatar_url_3");
        assigneeInfoList.put(info3);
        JSONObject info4 = new JSONObject();
        info4.put(MessagingService.ALIAS_PROPERTY, "will4");
        info4.put(MessagingService.AVATAR_PROPERTY, "avatar_url_4");
        assigneeInfoList.put(info4);
        MailjetEmailParams params = new MailjetEmailParams(
            Arrays.asList(new ImmutablePair<>("will", "example@example.com")),
            "TestSubject",
            null,
            MailjetEmailClient.Template.TASK_DUE_NOTIFICATION,
            MessagingService.TASK_NAME_PROPERTY,
            "exampleTaskName",
            MessagingService.TIMESTAMP_PROPERTY,
            "Sat Aug 22 01:37:07 PDT 2020",
            MessagingService.TASK_URL_PROPERTY,
            MessagingService.BASE_TASK_URL + 5903
        );
        LOGGER.info("assigneeInfoList: {}", assigneeInfoList.toString());
        params.addKv(MessagingService.ASSIGNEES_PROPERTY, assigneeInfoList);

        mailjetEmailClient.sendAllEmailAsync(Arrays.asList(params));
    }
}
