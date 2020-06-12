package com.bulletjournal.controller.models;

public class SetTaskStatusParams {
    private TaskStatus status;

    public String toText(TaskStatus status) {
        if (status.equals(TaskStatus.IN_PROGRESS))
            return "IN PROGRESS";
        else if (status.equals(TaskStatus.NEXT_TO_DO))
            return "NEXT TO DO";
        else if (status.equals(TaskStatus.ON_HOLD))
            return "ON HOLD";
        else if (status.equals(TaskStatus.READY))
            return "READY";
        else
            return null;
    }

    public SetTaskStatusParams() {
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

}