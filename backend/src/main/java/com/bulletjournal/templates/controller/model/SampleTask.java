package com.bulletjournal.templates.controller.model;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class SampleTask {

    private Long id;

    private String name;

    private String content;

    private String metadata;

    private String timeZone;

    private String uid;

    private String dueDate;

    private String dueTime;

    private Choice choice;

    private boolean pending;

    private boolean refreshable;

    private String raw;

    public SampleTask() {
    }

    public SampleTask(
            Long id,
            String name) {
        this(id, name, null, null, null, null, null, null, false, false, null);
    }

    public SampleTask(
            Long id,
            String name,
            String content,
            String metadata,
            String uid,
            String dueDate,
            String dueTime,
            String timeZone,
            boolean pending, boolean refreshable, String raw) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.metadata = metadata;
        this.uid = uid;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.timeZone = timeZone;
        this.pending = pending;
        this.refreshable = refreshable;
        this.raw = raw;
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

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }

    public boolean isPending() {
        return pending;
    }

    public void setPending(boolean pending) {
        this.pending = pending;
    }

    public boolean isRefreshable() {
        return refreshable;
    }

    public void setRefreshable(boolean refreshable) {
        this.refreshable = refreshable;
    }

    public String getRaw() {
        return raw;
    }

    public void setRaw(String raw) {
        this.raw = raw;
    }
}
