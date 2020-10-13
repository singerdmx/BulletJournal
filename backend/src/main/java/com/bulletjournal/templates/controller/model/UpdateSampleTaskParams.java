package com.bulletjournal.templates.controller.model;

public class UpdateSampleTaskParams {

    private String name;

    private String content;

    private String metadata;

    private String uid;

    private String timeZone;

    private boolean pending;

    private boolean refreshable;

    public boolean isPending() {
        return pending;
    }

    public void setPending(boolean pending) {
        this.pending = pending;
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

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public String getUid() {
        if (uid == null) {
            return null;
        }
        return uid.trim();
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public boolean isRefreshable() {
        return refreshable;
    }

    public void setRefreshable(boolean refreshable) {
        this.refreshable = refreshable;
    }
}
