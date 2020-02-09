package com.bulletjournal.clients;
import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.redis.UserRepository;
import java.util.Optional;
import org.junit.Assert;
import org.junit.Test;
import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.models.User;
import org.mockito.Mockito;

/**
 * Tests {@link UserClient}
 */
public class UserClientTests {

    @Test
    public void testGetUser() throws Exception {

        String username = "BulletJournal";
        String expectedThumbnail = "https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/37/15287_2.png";
        String expectedAvatar = "https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/75/15287_2.png";
        String expectedUserTimeZone = "America/Los_Angeles";
        String expectedUserEmail = "todo1o24@outlook.com";

        UserRepository redisUserRepository = Mockito.mock(UserRepository.class);
        Mockito.when(redisUserRepository.findById(username)).thenReturn(Optional.empty());

        AuthConfig authConfig = new AuthConfig();
        authConfig.setDefaultUserTimezone(expectedUserTimeZone);
        authConfig.setDefaultUserEmail(expectedUserEmail);
        UserClient userClient = new UserClient(new SSOConfig(
                "https://1o24bbs.com"), authConfig, redisUserRepository);

        User user = userClient.getUser(username);
        Assert.assertEquals(username, user.getName());
        Assert.assertEquals(expectedAvatar,
                user.getAvatar());
        Assert.assertEquals(expectedThumbnail,
                user.getThumbnail());
        Assert.assertEquals(authConfig.getDefaultUserEmail(), user.getEmail());
        Assert.assertEquals(authConfig.getDefaultUserTimezone(), user.getTimezone());
    }
}
