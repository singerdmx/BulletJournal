package com.bulletjournal.clients;

import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.redis.RedisUserRepository;
import com.bulletjournal.repository.UserDaoJpa;
import org.junit.Assert;
import org.junit.Test;

import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Tests {@link UserClient}
 */
public class UserClientTests {

    @Test
    public void testGetUser() throws Exception {

        String username = "BulletJournal";
        String expectedThumbnail = "https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/37/16257_2.png";
        String expectedAvatar = "https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/75/16257_2.png";

        RedisUserRepository redisUserRepository = mock(RedisUserRepository.class);
        when(redisUserRepository.findById(username)).thenReturn(Optional.empty());
        UserDaoJpa userDaoJpa = mock(UserDaoJpa.class);
        com.bulletjournal.repository.models.User u = new com.bulletjournal.repository.models.User();
        u.setName(username);
        u.setEmail("todo1o24@outlook.com");
        when(userDaoJpa.create(username, "America/Los_Angeles")).thenReturn(u);
        MockUserAliasDaoJpa userAliasDaoJpa = new MockUserAliasDaoJpa();

        UserClient userClient = new UserClient(new SSOConfig(
                "https://1o24bbs.com"), redisUserRepository, userDaoJpa, userAliasDaoJpa);

        User user = userClient.getUser(username);
        Assert.assertEquals(username, user.getName());
        Assert.assertEquals(expectedAvatar,
                user.getAvatar());
        Assert.assertEquals(expectedThumbnail,
                user.getThumbnail());
        Assert.assertEquals(6475, user.getId().intValue());
    }
}
