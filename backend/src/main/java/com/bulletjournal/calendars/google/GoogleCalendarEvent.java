package com.bulletjournal.calendars.google;

import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.Task;

public class GoogleCalendarEvent {

    private Task task;

    private Content content;

    private String eventId;

    public GoogleCalendarEvent() {
    }

    public GoogleCalendarEvent(Task task, Content content, String eventId) {
        this.task = task;
        this.content = content;
        this.eventId = eventId;
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
}
