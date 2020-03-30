package com.bulletjournal.controller.utils;

import com.bulletjournal.clients.UserClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class TestHelpers {

    @SafeVarargs
    public static <T> void assertIfContains(List<T> container, T... objects) {
        for (T object : objects) {
            assertTrue(container.contains(object));
        }
    }

    @SafeVarargs
    public static <T> void assertIfNotContains(List<T> container, T... objects) {
        for (T object : objects) {
            assertFalse(container.contains(object));
        }
    }

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
