package com.bulletjournal.templates.controller.model;


import java.util.ArrayList;
import java.util.List;

public class NextStep {

    private Step step;

    private List<SampleTask> sampleTasks = new ArrayList<>();

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public List<SampleTask> getTasks() {
        return sampleTasks;
    }

    public void setTasks(List<SampleTask> sampleTasks) {
        this.sampleTasks = sampleTasks;
    }
}
