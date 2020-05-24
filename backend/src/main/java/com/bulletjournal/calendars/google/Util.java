package com.bulletjournal.calendars.google;

import com.google.api.services.calendar.model.Channel;
import com.google.common.collect.ImmutableMap;

import java.util.UUID;

import static com.bulletjournal.controller.GoogleCalendarController.CHANNEL_NOTIFICATIONS_ROUTE;

public class Util {

    private static final String WATCH_CHANNEL_TOKEN = "BuJo";

    public static Channel getChannel() {
        Channel channel = new Channel();
        channel.setId(UUID.randomUUID().toString());
        channel.setType("web_hook");
        channel.setToken(WATCH_CHANNEL_TOKEN);
        channel.setAddress("https://bulletjournal.us" + CHANNEL_NOTIFICATIONS_ROUTE);
        channel.setParams(ImmutableMap.of("ttl", "99999999"));
        return channel;
    }
}
