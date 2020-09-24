package com.bulletjournal.templates.controller.model;

import java.util.List;

public class SampleTasks {
    private List<SampleTask> sampleTasks;
    private String scrollId;

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
