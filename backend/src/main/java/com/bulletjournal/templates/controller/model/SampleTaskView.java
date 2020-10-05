package com.bulletjournal.templates.controller.model;

import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.SampleTask;

public class SampleTaskView {
    private SampleTask task;
    private Content content;

    public SampleTaskView() {
    }

    public SampleTaskView(SampleTask task, Content content) {
        this.task = task;
        this.content = content;
    }

    public SampleTask getTask() {
        return task;
    }

    public void setTask(SampleTask task) {
        this.task = task;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }
}
