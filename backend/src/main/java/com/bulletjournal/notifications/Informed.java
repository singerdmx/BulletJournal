package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Notification;
import com.google.common.collect.ImmutableList;

import java.util.List;
import java.util.stream.Collectors;

public abstract class Informed {

    private List<Event> events;
    private String originator;

    public Informed(Event event, String originator) {
        this.events = ImmutableList.of(event);
        this.originator = originator;
    }

    public Informed(List<Event> events, String originator) {
        this.events = events;
        this.originator = originator;
    }

    public abstract ContentType getContentType();
    protected abstract String getEventTitle(Event event);

    public List<Notification> toNotifications() {
        return this.getEvents().stream()
                .map(event -> new Notification(
                        this.getOriginator(),
                        this.getEventTitle(event),
                        null,
                        event.getTargetUser(),
                        this.getEventType(),
                        event.getContentId()))
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
