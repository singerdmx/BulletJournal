package com.bulletjournal.clients;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.models.User;

@Component
public class UserClient {

	public static final String USER_NAME_KEY = "discourse-user-name";
	private static final String AVATAR_SIZE = "75";
	private static final String THUMBNAIL_SIZE = "37";
	private static final String SIZE_HOLDER = "{size}";
	
	private final RestTemplate restClient;
	private final URI ssoEndPoint;
	
	@Autowired
	public UserClient(SSOConfig ssoConfig) throws URISyntaxException {
		this.restClient = new RestTemplate();
		this.ssoEndPoint = new URI(ssoConfig.getEndpoint());
	}

	@SuppressWarnings("rawtypes")
	public User getUser(String username) {
		// TODO: get user info from redis

		String url = this.ssoEndPoint.resolve("/u/" + username + ".json").toString();
		LinkedHashMap userInfo = (LinkedHashMap) this.restClient.getForObject(url, LinkedHashMap.class).get("user");
		String avatarTemplate = (String) userInfo.get("avatar_template");
		String avatar = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, AVATAR_SIZE)).toString();
		String thumbnail = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, THUMBNAIL_SIZE)).toString();
		
		return new User(username, thumbnail, avatar);
	}
	
}
