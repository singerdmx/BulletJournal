package com.bulletjournal.controller.models;

public class SetTaskStatusParams {
    private TaskStatus status;

    public SetTaskStatusParams() {
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

}