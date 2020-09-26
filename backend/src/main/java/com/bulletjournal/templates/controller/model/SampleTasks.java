package com.bulletjournal.templates.controller.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;
import java.util.Objects;

@RedisHash(value = "SampleTasks", timeToLive = 60000)
public class SampleTasks {

    private List<SampleTask> sampleTasks;

    @Id
    private String scrollId;

    public SampleTasks() {

    }

    public SampleTasks(String scrollId, List<SampleTask> sampleTaskList) {
        this.scrollId = scrollId;
        this.sampleTasks = sampleTaskList;
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

    // Only use scroll id to identify
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SampleTasks that = (SampleTasks) o;
        return Objects.equals(getScrollId(), that.getScrollId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getScrollId());
    }
}
