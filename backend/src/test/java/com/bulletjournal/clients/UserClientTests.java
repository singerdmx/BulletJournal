package com.bulletjournal.clients;

import com.bulletjournal.config.AuthConfig;
import org.junit.Assert;
import org.junit.Test;

import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.models.User;

/**
 * Tests {@link UserClient}
 */
public class UserClientTests {

    @Test
    public void testGetUser() throws Exception {
        AuthConfig authConfig = new AuthConfig();
        authConfig.setDefaultUserTimezone("America/Los_Angeles");
        authConfig.setDefaultUserEmail("todo1o24@outlook.com");
        UserClient userClient = new UserClient(new SSOConfig("https://1o24bbs.com"), authConfig);
        String username = "BulletJournal";
        User user = userClient.getUser(username);
        Assert.assertEquals(username, user.getName());
        Assert.assertEquals("https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/75/15287_2.png",
                user.getAvatar());
        Assert.assertEquals("https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/37/15287_2.png",
                user.getThumbnail());
        Assert.assertEquals(authConfig.getDefaultUserEmail(), user.getEmail());
        Assert.assertEquals(authConfig.getDefaultUserTimezone(), user.getTimezone());
    }
}
