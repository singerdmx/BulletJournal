package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Notification;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;

import java.util.List;
import java.util.stream.Collectors;

public abstract class Informed {

    private List<Event> events;
    private String originator;
    private static final Gson GSON = new Gson();

    public Informed(Event event, String originator) {
        this.events = ImmutableList.of(event);
        this.originator = originator;
    }

    public Informed(List<Event> events, String originator) {
        this.events = events;
        this.originator = originator;
    }

    public abstract ContentType getContentType();

    protected List<Action> getEventActions(Event event) {
        return null;
    }

    protected abstract String getEventTitle(Event event);

    public List<Notification> toNotifications() {
        return this.getEvents().stream()
                .map(event -> {
                    Notification notification = new Notification(
                            this.getOriginator(),
                            this.getEventTitle(event),
                            null,
                            event.getTargetUser(),
                            this.getEventType(),
                            event.getContentId());
                    List<Action> actions = this.getEventActions(event);
                    if (actions != null) {
                        notification.setActions(GSON.toJson(actions));
                    }
                    return notification;
                })
                .collect(Collectors.toList());
    }

    public String getEventType() {
        return getClass().getSimpleName();
    }

    protected String getEventContent(Event event) {
        return null;
    }

    public List<Event> getEvents() {
        return events;
    }

    public List<Event> addEvent(Event event) {
        this.events.add(event);
        return this.events;
    }

    public String getOriginator() {
        return this.originator;
    }
}
