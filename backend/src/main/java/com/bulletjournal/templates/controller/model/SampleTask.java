package com.bulletjournal.templates.controller.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class SampleTask {

    private Long id;

    private String name;

    private String content;

    private String metadata;

    private String uid;

    private String dueDate;

    private String dueTime;

    private Timestamp availableBefore;

    private Integer reminderBeforeTask;

    private List<Step> steps = new ArrayList<>();

    public SampleTask() {
    }

    public SampleTask(
        Long id,
        String name,
        String content,
        String metadata,
        List<Step> steps,
        String uid,
        String dueDate,
        String dueTime,
        Timestamp availableBefore,
        Integer reminderBeforeTask
    ) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.metadata = metadata;
        this.steps = steps;
        this.uid = uid;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.availableBefore = availableBefore;
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getDueTime() {
        return dueTime;
    }

    public void setDueTime(String dueTime) {
        this.dueTime = dueTime;
    }

    public Timestamp getAvailableBefore() {
        return availableBefore;
    }

    public void setAvailableBefore(Timestamp availableBefore) {
        this.availableBefore = availableBefore;
    }

    public Integer getReminderBeforeTask() {
        return reminderBeforeTask;
    }

    public void setReminderBeforeTask(Integer reminderBeforeTask) {
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }
}
