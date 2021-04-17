package com.bulletjournal.calendars.google;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.ProjectItem;
import com.bulletjournal.controller.models.Task;

import java.util.List;

public class GoogleCalendarEvent {

    private Task task;

    private Content content;

    private String eventId;

    private String description;

    public GoogleCalendarEvent() {
    }

    public GoogleCalendarEvent(Task task, Content content, String eventId, String description) {
        this.task = task;
        this.content = content;
        this.eventId = eventId;
        this.description = description;
    }

    public static List<GoogleCalendarEvent> addAvatar(
            List<GoogleCalendarEvent> events, final UserClient userClient) {
        events.forEach(e -> addAvatar(e, userClient));
        return events;
    }

    public static GoogleCalendarEvent addAvatar(
            GoogleCalendarEvent event, final UserClient userClient) {
        ProjectItem.addAvatar(event.task, userClient);
        Content.addOwnerAvatar(event.content, userClient);
        return event;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "GoogleCalendarEvent{" +
                "task=" + task +
                ", content=" + content +
                ", eventId='" + eventId + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
