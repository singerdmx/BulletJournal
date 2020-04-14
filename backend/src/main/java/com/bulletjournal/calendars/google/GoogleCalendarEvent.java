package com.bulletjournal.calendars.google;

import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.Task;

public class GoogleCalendarEvent {

    private Task task;

    private Content content;

    private String iCalUID;

    public GoogleCalendarEvent() {
    }

    public GoogleCalendarEvent(Task task, Content content, String iCalUID) {
        this.task = task;
        this.content = content;
        this.iCalUID = iCalUID;
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

    public String getiCalUID() {
        return iCalUID;
    }

    public void setiCalUID(String iCalUID) {
        this.iCalUID = iCalUID;
    }
}
