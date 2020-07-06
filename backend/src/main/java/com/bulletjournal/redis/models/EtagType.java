package com.bulletjournal.redis.models;

public enum EtagType {
    NOTIFICATION(0, "Notification"),
    GROUP(1, "Group"),
    PROJECT(2, "Project"),
    USER_PROJECTS(3, "UserProjects");

    public final int value;

    public final String text;

    EtagType(int value, String text) {
        this.value = value;
        this.text = text;
    }

    public static EtagType of(String type) {
        switch (type) {
            case "Notification":
                return NOTIFICATION;
            case "Group":
                return GROUP;
            case "Project":
                return PROJECT;
            case "UserProjects":
                return USER_PROJECTS;
            default:
                throw new IllegalArgumentException("Unknown Etag Type");
        }
    }

    @Override
    public String toString() {
        return text;
    }
}
