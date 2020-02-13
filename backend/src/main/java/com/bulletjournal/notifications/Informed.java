package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Notification;

import java.util.List;

public abstract class Informed {

    private List<Event> events;
    private String originator;

    public abstract ContentType getContentType();
    public abstract String getEventType();
    public abstract List<Notification> toNotifications();

    public Informed(List<Event> events, String originator) {
        this.events = events;
        this.originator = originator;
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
