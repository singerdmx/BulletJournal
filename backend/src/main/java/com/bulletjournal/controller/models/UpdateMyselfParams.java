package com.bulletjournal.controller.models;

public class UpdateMyselfParams {

    private String timezone;

    private Integer reminderBeforeTask;

    private String currency;

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

    public boolean hasReminderBeforeTask() {
        return this.reminderBeforeTask != null;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
