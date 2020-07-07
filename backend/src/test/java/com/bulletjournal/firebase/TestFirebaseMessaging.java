package com.bulletjournal.firebase;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TestFirebaseMessaging {
    @Autowired
    FcmService fcmService;

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
}
