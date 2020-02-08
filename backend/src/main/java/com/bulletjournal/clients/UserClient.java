package com.bulletjournal.clients;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;

import com.bulletjournal.config.AuthConfig;
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
	private final String ssoAPIParams;
	private final AuthConfig authConfig;
	
	@Autowired
	public UserClient(SSOConfig ssoConfig, AuthConfig authConfig) throws URISyntaxException {
		this.restClient = new RestTemplate();
		this.ssoEndPoint = new URI(ssoConfig.getEndpoint());
		this.ssoAPIParams = ssoConfig.getAPIKey() == null ? null :
				"?api_username=system&api_key=" + ssoConfig.getAPIKey();
		this.authConfig = authConfig;
	}

	@SuppressWarnings("rawtypes")
	public User getUser(String username) {
		// TODO: get user info from redis

		String relativePath = "/u/" + username + ".json";
		if (this.ssoAPIParams != null) {
			relativePath += this.ssoAPIParams;
		}
		String url = this.ssoEndPoint.resolve(relativePath).toString();
		LinkedHashMap userInfo = (LinkedHashMap) this.restClient.getForObject(url, LinkedHashMap.class).get("user");
		String avatarTemplate = (String) userInfo.get("avatar_template");
		String avatar = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, AVATAR_SIZE)).toString();
		String thumbnail = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, THUMBNAIL_SIZE)).toString();
		String timezone = this.authConfig.getDefaultUserTimezone();
		if (this.ssoAPIParams != null) {
			timezone = (String) ((LinkedHashMap) userInfo.get("user_option")).get("timezone");
		}

		String email = this.authConfig.getDefaultUserEmail();
		if (this.ssoAPIParams != null) {
			url = this.ssoEndPoint.resolve( "/u/" + username + "/emails.json" + this.ssoAPIParams).toString();
			email = (String) this.restClient.getForObject(url, LinkedHashMap.class).get("email");
		}

		return new User(username, thumbnail, avatar, timezone, email);
	}
	
}
