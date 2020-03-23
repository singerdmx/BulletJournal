package com.bulletjournal.controller.utils;

import com.bulletjournal.clients.UserClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

public class TestHelpers {

    public static <T> HttpEntity actAsOtherUser(T body, String username, String... eTags) {
        final HttpHeaders headers = new HttpHeaders();
        headers.set(UserClient.USER_NAME_KEY, username);

        if (eTags.length > 0)
            headers.setIfNoneMatch(eTags[0]);

        if (body == null) {
            return new HttpEntity<>(headers);
        }

        return new HttpEntity<>(body, headers);
    }

}
