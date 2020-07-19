package com.bulletjournal.controller.models;

public class UpdateMyselfParams {

    private String timezone;

    private Integer reminderBeforeTask;

    private String currency;

    private String theme;

    private String email;

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

    public boolean hasCurrency() {
        return this.currency != null;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean hasTheme() {
        return this.theme != null;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean hasEmail() {
        return this.email != null;
    }
}
