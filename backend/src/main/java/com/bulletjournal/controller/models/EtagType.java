package com.bulletjournal.controller.models;

public enum EtagType {
    NOTIFICATION(0, "Notification"),
    GROUP(1, "Group"),
    PROJECTS(2, "Projects");

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
