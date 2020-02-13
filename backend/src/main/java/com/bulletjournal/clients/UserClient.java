package com.bulletjournal.clients;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;
import java.util.Optional;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.redis.RedisUserRepository;
import com.bulletjournal.repository.UserDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.models.User;

@Component
public class UserClient {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserClient.class);
    public static final String USER_NAME_KEY = "discourse-user-name";
    private static final String AVATAR_SIZE = "75";
    private static final String THUMBNAIL_SIZE = "37";
    private static final String SIZE_HOLDER = "{size}";

    private final RestTemplate restClient;
    private final URI ssoEndPoint;
    private final String ssoAPIKey;
    private final RedisUserRepository redisUserRepository;
    private final UserDaoJpa userDaoJpa;

    @Autowired
    public UserClient(SSOConfig ssoConfig, RedisUserRepository redisUserRepository, UserDaoJpa userDaoJpa)
            throws URISyntaxException {
        this.restClient = new RestTemplate();
        this.ssoEndPoint = new URI(ssoConfig.getEndpoint());
        this.ssoAPIKey = ssoConfig.getAPIKey();
        this.redisUserRepository = redisUserRepository;
        this.userDaoJpa = userDaoJpa;
    }

    public void logout(String username) {
        if (this.ssoAPIKey == null) {
            return;
        }
        // build the request
        HttpEntity<?> request = buildHeaders();
        String url = this.ssoEndPoint.resolve("/admin/users/" + username + "/log_out").toString();
        this.restClient
                .exchange(url, HttpMethod.POST, request, Void.class);
    }

    @SuppressWarnings("rawtypes")
    public User getUser(String username) {
        User user;
        Optional<User> userOptional = redisUserRepository.findById(username);
        if (userOptional.isPresent()) {
            user = userOptional.get();
            return user;
        }

        try {
            user = getUserByREST(username);
        } catch (HttpClientErrorException ex) {
            throw new ResourceNotFoundException("Unable to find user " + username, ex);
        }

        try {
            this.userDaoJpa.create(username);
        } catch (ResourceAlreadyExistException ex) {
            LOGGER.info(username + " already exists");
        }

        redisUserRepository.save(user);
        return user;
    }

    public String getUserEmail(String username) {
        if (this.ssoAPIKey == null) {
            throw new IllegalArgumentException("ssoAPIKey missing");
        }
        String url = this.ssoEndPoint.resolve("/u/" + username + "/emails.json").toString();
        return (String) this.restClient
                .exchange(url, HttpMethod.GET, buildHeaders(), LinkedHashMap.class).getBody().get("email");
    }

    private User getUserByREST(String username) {
        String url = this.ssoEndPoint.resolve("/u/" + username + ".json").toString();
        LinkedHashMap userInfo = (LinkedHashMap) this.restClient
                .exchange(url, HttpMethod.GET, null, LinkedHashMap.class).getBody().get("user");
        Integer id = (Integer) userInfo.get("id");
        String avatarTemplate = (String) userInfo.get("avatar_template");
        String avatar = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, AVATAR_SIZE)).toString();
        String thumbnail = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, THUMBNAIL_SIZE)).toString();
        return new User(id, username, thumbnail, avatar);
    }

    private HttpEntity<LinkedHashMap> buildHeaders() {
        HttpEntity<LinkedHashMap> request;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Api-Username", "system");
        headers.add("Api-Key", this.ssoAPIKey);
        // build the request
        request = new HttpEntity(headers);
        return request;
    }

}
