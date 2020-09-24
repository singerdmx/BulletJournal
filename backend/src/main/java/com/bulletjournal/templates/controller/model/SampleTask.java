package com.bulletjournal.templates.controller.model;

import java.sql.Timestamp;

public class SampleTask {

    private Long id;

    private String name;

    private String content;

    private String metadata;

    private String timeZone;

    private String uid;

    private String dueDate;

    private String dueTime;

    private Timestamp availableBefore;

    public SampleTask() {
    }

    public SampleTask(
        Long id,
        String name,
        String content,
        String metadata,
        String uid,
        String dueDate,
        String dueTime,
        Timestamp availableBefore,
        String timeZone
    ) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.metadata = metadata;
        this.uid = uid;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.availableBefore = availableBefore;
        this.timeZone = timeZone;
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

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
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

}
