package com.bulletjournal.controller.models;

public class ProjectSetting {
    private String color;

    private boolean autoDelete;

    public ProjectSetting() {

    }

    public ProjectSetting(String color, boolean autoDelete) {
        this.color = color;
        this.autoDelete = autoDelete;
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
