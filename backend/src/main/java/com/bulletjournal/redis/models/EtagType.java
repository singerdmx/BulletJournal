package com.bulletjournal.redis.models;

public enum EtagType {
    NOTIFICATION(0, "Notification"),
    GROUP(1, "Group"),
    PROJECT(2, "Project"),
    USER_PROJECT(3, "UserProject");

    public final int value;

    public final String text;

    EtagType(int value, String text) {
        this.value = value;
        this.text = text;
    }

    public static EtagType of(String type) {
        return EtagType.valueOf(type);
    }

    @Override
    public String toString() {
        return text;
    }
}
