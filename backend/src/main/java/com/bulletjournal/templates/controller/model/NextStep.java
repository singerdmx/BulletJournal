package com.bulletjournal.templates.controller.model;


import java.util.ArrayList;
import java.util.List;

public class NextStep {

    private Step step;

    private List<SampleTask> sampleTasks = new ArrayList<>();

    private String scrollId;

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public List<SampleTask> getSampleTasks() {
        return sampleTasks;
    }

    public void setSampleTasks(List<SampleTask> sampleTasks) {
        this.sampleTasks = sampleTasks;
    }

    public String getScrollId() {
        return scrollId;
    }

    public void setScrollId(String scrollId) {
        this.scrollId = scrollId;
    }
}
