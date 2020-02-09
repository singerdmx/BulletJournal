package com.bulletjournal.clients;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.redis.RedisUserRepository;
import com.bulletjournal.repository.UserDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
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
    private final AuthConfig authConfig;
    private final RedisUserRepository redisUserRepository;
    private final  UserDaoJpa userDaoJpa;

    @Autowired
    public UserClient(SSOConfig ssoConfig, AuthConfig authConfig,
                      RedisUserRepository redisUserRepository, UserDaoJpa userDaoJpa)
            throws URISyntaxException {
        this.restClient = new RestTemplate();
        this.ssoEndPoint = new URI(ssoConfig.getEndpoint());
        this.ssoAPIKey = ssoConfig.getAPIKey();
        this.authConfig = authConfig;
        this.redisUserRepository = redisUserRepository;
        this.userDaoJpa = userDaoJpa;
    }

    @SuppressWarnings("rawtypes")
    public User getUser(String username) {
        User user;
        Optional<User> userOptional = redisUserRepository.findById(username);
        if (userOptional.isPresent()) {
            user = userOptional.get();
            return user;
        }

        CompletableFuture.runAsync(() -> {
            try {
                this.userDaoJpa.create(username);
            } catch (ResourceAlreadyExistException ex) {
                LOGGER.info("OK to ignore", ex);
            }
        });
        user = getUserByREST(username);
        redisUserRepository.save(user);
        return user;
    }

    private User getUserByREST(String username) {
        HttpEntity<LinkedHashMap> request = null;
        if (this.ssoAPIKey != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Api-Username", "system");
            headers.add("Api-Key", this.ssoAPIKey);
            // build the request
            request = new HttpEntity(headers);
        }
        String url = this.ssoEndPoint.resolve("/u/" + username + ".json").toString();
        LinkedHashMap userInfo = (LinkedHashMap) this.restClient
                .exchange(url, HttpMethod.GET, request, LinkedHashMap.class).getBody().get("user");
        String avatarTemplate = (String) userInfo.get("avatar_template");
        String avatar = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, AVATAR_SIZE)).toString();
        String thumbnail = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, THUMBNAIL_SIZE)).toString();
        String timezone = null;
        if (this.ssoAPIKey != null) {
            // If user never sets timezone in sso provider, it defaults to "America/Los_Angeles"
            timezone = (String) ((LinkedHashMap) userInfo.get("user_option")).get("timezone");
        }
        if (timezone == null) {
            timezone = this.authConfig.getDefaultUserTimezone();
        }

        String email = this.authConfig.getDefaultUserEmail();
        if (this.ssoAPIKey != null) {
            url = this.ssoEndPoint.resolve("/u/" + username + "/emails.json").toString();
            email = (String) this.restClient
                    .exchange(url, HttpMethod.GET, request, LinkedHashMap.class).getBody().get("email");
        }

        return new User(username, thumbnail, avatar, timezone, email);
    }

}
