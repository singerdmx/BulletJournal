package com.bulletjournal.controller.models;

public class SetTaskStatusParams {
    private TaskStatus status;
    private String timezone;

    public SetTaskStatusParams() {
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}