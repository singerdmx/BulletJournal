package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Myself extends User {

    private String timezone;

    private Before reminderBeforeTask;

    public Myself() {
    }

    public Myself(User user, String timezone, Before reminderBeforeTask) {
        super(user.getId(), user.getName(), user.getThumbnail(), user.getAvatar());
        this.timezone = timezone;
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean hasTimezone() {
        return this.timezone != null;
    }

    public Before getBefore() {
        return reminderBeforeTask;
    }

    public void setBefore(Before before) {
        this.reminderBeforeTask = before;
    }

    public boolean hasBefore() {
        return this.reminderBeforeTask != null;
    }
}
