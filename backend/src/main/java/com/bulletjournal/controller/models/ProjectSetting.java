package com.bulletjournal.controller.models;

public class ProjectSetting {
    private String color;

    private boolean autoDelete;

    // Allow everyone in this BuJo to edit contents
    private boolean allowEditContents;

    public ProjectSetting() {
    }

    public ProjectSetting(String color, boolean autoDelete, boolean allowEditContents) {
        this.color = color;
        this.autoDelete = autoDelete;
        this.allowEditContents = allowEditContents;
    }

    public boolean isAllowEditContents() {
        return allowEditContents;
    }

    public void setAllowEditContents(boolean allowEditContents) {
        this.allowEditContents = allowEditContents;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isAutoDelete() {
        return autoDelete;
    }

    public void setAutoDelete(boolean autoDelete) {
        this.autoDelete = autoDelete;
    }

}
