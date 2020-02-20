package com.bulletjournal.controller.models;

public class UpdateMyselfParams {

    private String timezone;

    private Before reminderBeforeTask;

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean hasTimezone() {
        return this.timezone != null;
    }

    public Before getReminderBeforeTask() {
        return reminderBeforeTask;
    }

    public void setReminderBeforeTask(Before reminderBeforeTask) {
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public boolean hasReminderBeforeTask() {
        return this.reminderBeforeTask != null;
    }
}
