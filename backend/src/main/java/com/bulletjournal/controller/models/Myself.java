package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Myself extends User {

    private String timezone;

    private Integer reminderBeforeTask;

    private String currency;

    public Myself() {
    }

    public Myself(User user, String timezone, Before reminderBeforeTask, String currency) {
        super(user.getId(), user.getName(), user.getThumbnail(), user.getAvatar());
        this.timezone = timezone;
        if (reminderBeforeTask != null) {
            this.reminderBeforeTask = reminderBeforeTask.getValue();
        }
        this.currency = currency;
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

    public Integer getReminderBeforeTask() {
        return reminderBeforeTask;
    }

    public void setReminderBeforeTask(Integer reminderBeforeTask) {
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public boolean hasBefore() {
        return this.reminderBeforeTask != null;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
