package com.bulletjournal.clients;

import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.models.UpdateMyselfParams;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.redis.RedisUserRepository;
import com.bulletjournal.repository.UserAliasDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;
import java.util.Optional;

@Component
public class UserClient {
    public static final String USER_NAME_KEY = "discourse-user-name";
    public static final String API_USERNAME = "Api-Username";
    public static final String API_KEY = "Api-Key";
    private static final Logger LOGGER = LoggerFactory.getLogger(UserClient.class);
    private static final String AVATAR_SIZE = "75";
    private static final String THUMBNAIL_SIZE = "37";
    private static final String SIZE_HOLDER = "{size}";
    private static final String DEFAULT_USER_TIME_ZONE = "America/Los_Angeles";
    private final RestTemplate restClient;
    private final URI ssoEndPoint;
    private final String ssoAPIKey;
    private final RedisUserRepository redisUserRepository;
    private final UserDaoJpa userDaoJpa;
    private final UserAliasDaoJpa userAliasDaoJpa;

    @Autowired
    public UserClient(SSOConfig ssoConfig, RedisUserRepository redisUserRepository,
                      UserDaoJpa userDaoJpa, UserAliasDaoJpa userAliasDaoJpa)
            throws URISyntaxException {
        this.restClient = new RestTemplate();
        this.ssoEndPoint = new URI(ssoConfig.getEndpoint());
        this.ssoAPIKey = ssoConfig.getAPIKey();
        this.redisUserRepository = redisUserRepository;
        this.userDaoJpa = userDaoJpa;
        this.userAliasDaoJpa = userAliasDaoJpa;
    }

    public void logout(String username) {
        if (this.ssoAPIKey == null) {
            return;
        }
        // build the request
        HttpEntity<?> request = buildHeaders();
        User user = getUser(username);
        String url = this.ssoEndPoint.resolve("/admin/users/" + user.getId() + "/log_out").toString();
        this.restClient
                .exchange(url, HttpMethod.POST, request, Void.class);
    }

    /**
     * DO NOT wrap this function inside @Transactional
     */
    @SuppressWarnings("rawtypes")
    public User getUser(String username) {
        User user;
        Optional<User> userOptional = redisUserRepository.findById(username);
        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setAlias(user.getName()); // disable caching user alias
            return this.userAliasDaoJpa.updateUserAlias(user);
        }

        LinkedHashMap userInfo;
        try {
            userInfo = getSSOUserInfo(username);
            // SSO is case-insensitive for username
            username = (String) userInfo.get("username");
            user = getUser(username, userInfo);
        } catch (HttpClientErrorException ex) {
            throw new ResourceNotFoundException("Unable to find user " + username, ex);
        }

        try {
            com.bulletjournal.repository.models.User createdUser
                = this.userDaoJpa.create(username, getUserTimeZone(userInfo));
            updateEmail(createdUser);
        } catch (ResourceAlreadyExistException ex) {
            LOGGER.info(username + " already exists");
        }

        redisUserRepository.save(user);
        return this.userAliasDaoJpa.updateUserAlias(user);
    }

    private String getUserTimeZone(LinkedHashMap userInfo) {
        if (this.ssoAPIKey == null) {
            return DEFAULT_USER_TIME_ZONE;
        }

        String timezone = (String) ((LinkedHashMap) userInfo.get("user_option")).get("timezone");
        if (timezone == null) {
            timezone = DEFAULT_USER_TIME_ZONE;
        }

        return timezone;
    }

    private String getUserEmail(String username) {
        if (this.ssoAPIKey == null) {
            throw new IllegalArgumentException("ssoAPIKey missing");
        }
        String url = this.ssoEndPoint.resolve("/u/" + username + "/emails.json").toString();
        return (String) this.restClient
                .exchange(url, HttpMethod.GET, buildHeaders(), LinkedHashMap.class).getBody().get("email");
    }

    private User getUser(String username, LinkedHashMap userInfo) {
        Integer id = (Integer) userInfo.get("id");
        String avatarTemplate = (String) userInfo.get("avatar_template");
        String avatar = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, AVATAR_SIZE)).toString();
        String thumbnail = this.ssoEndPoint.resolve(avatarTemplate.replace(SIZE_HOLDER, THUMBNAIL_SIZE)).toString();
        return new User(id, username, thumbnail, avatar);
    }

    private LinkedHashMap getSSOUserInfo(String username) {
        String url = this.ssoEndPoint.resolve("/u/" + username + ".json").toString();
        return (LinkedHashMap) this.restClient
                .exchange(url, HttpMethod.GET, buildHeaders(), LinkedHashMap.class).getBody().get("user");
    }

    private HttpEntity<LinkedHashMap> buildHeaders() {
        if (this.ssoAPIKey == null) {
            return null;
        }
        HttpEntity<LinkedHashMap> request;
        HttpHeaders headers = new HttpHeaders();
        headers.add(API_USERNAME, "system");
        headers.add(API_KEY, this.ssoAPIKey);
        // build the request
        request = new HttpEntity(headers);
        return request;
    }

    public void uploadAvatar(MultipartFile file, String username) throws IOException {
        if (this.ssoAPIKey == null) {
            throw new IllegalArgumentException("ssoAPIKey missing");
        }

        HttpHeaders headers = getHttpHeaders(username, MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, String> fileMap = new LinkedMultiValueMap<>();
        ContentDisposition contentDisposition = ContentDisposition
                .builder("form-data")
                .name("file")
                .filename(file.getOriginalFilename())
                .build();
        fileMap.add(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString());
        HttpEntity<byte[]> fileEntity = new HttpEntity<>(file.getBytes(), fileMap);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileEntity);
        body.add("type", "avatar");
        body.add("user_id", this.getUser(username).getId());

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);
        String url = this.ssoEndPoint.resolve("/uploads.json").toString();
        ResponseEntity<LinkedHashMap> response = this.restClient.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                LinkedHashMap.class);
        LOGGER.info("Upload avatar response {}", response);

        int uploadId = (Integer) response.getBody().get("id");
        headers = getHttpHeaders(username, MediaType.APPLICATION_JSON);
        url = this.ssoEndPoint.resolve("/users/" + username + "/preferences/avatar/pick").toString();
        response = this.restClient.exchange(
                url,
                HttpMethod.PUT,
                new HttpEntity<>(new PickAvatarParams("uploaded", uploadId), headers),
                LinkedHashMap.class);
        LOGGER.info("Pick avatar response {}", response);
    }

    private HttpHeaders getHttpHeaders(String username, MediaType mediaType) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(API_USERNAME, username);
        headers.add(API_KEY, this.ssoAPIKey);
        headers.setContentType(mediaType);
        return headers;
    }

    public String createTopic(String username, Integer forumId, String title, String content) {
        if (this.ssoAPIKey == null) {
            throw new IllegalArgumentException("ssoAPIKey missing");
        }
        String url = this.ssoEndPoint.resolve("/posts.json").toString();
        HttpHeaders headers = getHttpHeaders(username, MediaType.APPLICATION_JSON);
        ResponseEntity<LinkedHashMap> response = this.restClient.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(
                        new CreateTopicParams(title, content, forumId), headers),
                LinkedHashMap.class);
        LOGGER.info("Posts response {}", response);
        return this.ssoEndPoint.resolve(
                "/t/" + response.getBody().get("topic_slug") + "/" + response.getBody().get("topic_id")).toString();
    }

    public void updateEmail(com.bulletjournal.repository.models.User user) {
        if (user.getEmail() == null && this.ssoAPIKey != null) {
            String email = getUserEmail(user.getName());
            UpdateMyselfParams params = new UpdateMyselfParams();
            params.setEmail(email);
            this.userDaoJpa.updateMyself(user.getName(), params);
        }
    }
}
