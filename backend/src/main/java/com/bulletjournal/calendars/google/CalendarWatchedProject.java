package com.bulletjournal.calendars.google;

import com.bulletjournal.controller.models.Project;

public class CalendarWatchedProject {

    private String calendarId;
    private Project project;

    public CalendarWatchedProject() {
    }

    public CalendarWatchedProject(String calendarId, Project project) {
        this.calendarId = calendarId;
        this.project = project;
    }

    public String getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(String calendarId) {
        this.calendarId = calendarId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
