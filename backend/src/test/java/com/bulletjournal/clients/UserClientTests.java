package com.bulletjournal.clients;

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
		UserClient userClient = new UserClient(new SSOConfig("https://1o24bbs.com"));
		String username = "BulletJournal";
		User user = userClient.getUser(username);
		Assert.assertEquals(user.getName(), username);
		Assert.assertEquals(user.getAvatar(), "https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/75/15287_2.png");
		Assert.assertEquals(user.getThumbnail(), "https://1o24bbs.com/user_avatar/1o24bbs.com/bulletjournal/37/15287_2.png");
	}
}
