package com.bulletjournal.notifications;

import com.bulletjournal.repository.models.Task;

public class Remindable {
    private Task task;

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Remindable(Task task) {
        this.task = task;
    }
}
