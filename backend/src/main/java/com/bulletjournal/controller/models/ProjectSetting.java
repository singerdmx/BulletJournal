package com.bulletjournal.controller.models;

public class ProjectSetting {
    private String color;

    private boolean autoDelete;

    // Allow everyone in this BuJo to edit contents
    private boolean allowEditContents;

    // Allow everyone in this BuJo to edit project items;
    private boolean allowEditProjItems;

    public ProjectSetting() {
    }

    public ProjectSetting(String color, boolean autoDelete, boolean allowEditContents, boolean allowEditProjItems) {
        this.color = color;
        this.autoDelete = autoDelete;
        this.allowEditContents = allowEditContents;
        this.allowEditProjItems = allowEditProjItems;
    }

    public boolean isAllowEditContents() {
        return allowEditContents;
    }

    public void setAllowEditContents(boolean allowEditContents) {
        this.allowEditContents = allowEditContents;
    }

    public boolean isAllowEditProjItems() {
        return allowEditProjItems;
    }

    public void setAllowEditProjItems(boolean allowEditProjItems) {
        this.allowEditProjItems = allowEditProjItems;
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
