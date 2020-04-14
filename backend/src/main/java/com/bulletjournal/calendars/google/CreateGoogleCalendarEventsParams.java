package com.bulletjournal.calendars.google;

import java.util.List;

public class CreateGoogleCalendarEventsParams {
    private List<GoogleCalendarEvent> events;
    private Long projectId;

    public List<GoogleCalendarEvent> getEvents() {
        return events;
    }

    public void setEvents(List<GoogleCalendarEvent> events) {
        this.events = events;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
