package com.bulletjournal.controller;

import com.bulletjournal.controller.models.AddDeviceTokenParams;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.firebase.FcmMessageParams;
import com.bulletjournal.firebase.FcmService;
import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
import com.bulletjournal.repository.models.User;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
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
    UserDaoJpa userDaoJpa;

    @Autowired
    FcmService fcmService;

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

    /**
     * Submit token for USER1, should have (token, USER1) in DB
     * Submit same token for USER2, should have (token, USER2) in DB
     */
    @Test
    public void testAddToken() {
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
    }

    @Test
    @Ignore
    public void testFcm() throws Exception {
        FcmMessageParams params = new FcmMessageParams(
            "Title1",
            "testMessage1",
            "fZbt6xpGI_8:APA91bFs24liZn4wZgPMtGuL5KqvsJErwNCKB7sIm2Qd2FC4EdjjtCfStQoqzL-iGDomDHpv7sV8bdoCm_DTf9GuBmf5eZZBoNq2pYl_bNAJAPs6WK7zywg3TjHQ47mbtqJ7IaPkDSR5",
            null
        );
        fcmService.sendAllMessages(Arrays.asList(params));
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
}
