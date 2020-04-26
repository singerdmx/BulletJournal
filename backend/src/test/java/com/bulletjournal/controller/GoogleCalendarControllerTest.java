package com.bulletjournal.controller;

import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.model.Channel;
import org.junit.Assert;
import org.junit.Test;

/**
 * Tests {@link GoogleCalendarController}
 */
public class GoogleCalendarControllerTest {
    private static final GsonFactory GSON = new GsonFactory();

    /**
     * Tests {@link GoogleCalendarController#unwatchCalendar(String)}
     */
    @Test
    public void testUnwatchCalendar() throws Exception {
        String channel = "{\"expiration\":\"1590450627000\",\"id\":\"43f49558-7249-4763-a716-37a64e819855\",\"kind\":\"api#channel\",\"resourceId\":\"MLU-1HZZXY2SrBULRyDzK2nQqhY\",\"resourceUri\":\"https://www.googleapis.com/calendar/v3/calendars/uchkqbm2ffj1h2viroaau93tr4@group.calendar.google.com/events?maxResults=250&alt=json\",\"token\":\"BuJo\"}";
        Channel c = GSON.fromString(channel, Channel.class);
        Assert.assertNotNull(c);
    }
}
