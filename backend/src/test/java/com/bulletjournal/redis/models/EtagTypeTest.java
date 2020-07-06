package com.bulletjournal.redis.models;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class EtagTypeTest {

    @Test
    public void of() {
        assertEquals(EtagType.PROJECT, EtagType.of("Project"));
        assertEquals(EtagType.NOTIFICATION, EtagType.of("Notification"));
        assertEquals(EtagType.GROUP, EtagType.of("Group"));
        assertEquals(EtagType.USER_PROJECTS, EtagType.of("UserProjects"));
    }
}