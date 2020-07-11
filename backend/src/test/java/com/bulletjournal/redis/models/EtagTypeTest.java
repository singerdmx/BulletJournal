package com.bulletjournal.redis.models;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class EtagTypeTest {

    @Test
    public void of() {
        assertEquals(EtagType.NOTIFICATION, EtagType.of("Notification"));
        assertEquals(EtagType.GROUP, EtagType.of("Group"));
        assertEquals(EtagType.USER_GROUP, EtagType.of("UserGroups"));
    }
}