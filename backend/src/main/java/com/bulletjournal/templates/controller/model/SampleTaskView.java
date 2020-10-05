package com.bulletjournal.templates.controller.model;

import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.Task;

public class SampleTaskView {
    private Task task;
    private Content content;

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }
}
