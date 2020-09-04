package com.bulletjournal.templates.controller.model;

import com.bulletjournal.controller.models.Task;

import java.util.ArrayList;
import java.util.List;

public class NextStep {

    private Step step;

    private List<Task> tasks = new ArrayList<>();

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
