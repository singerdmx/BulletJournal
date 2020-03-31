package com.bulletjournal.controller.models;

public enum ProjectItemType {
    TASK(0),
    NOTE(1),
    TRANSACTION(2);

    private final int value;

    ProjectItemType(int value) {
        this.value = value;
    }

    public static ProjectItemType getType(int type) {
        switch (type) {
            case 0:
                return TASK;
            case 1:
                return NOTE;
            case 2:
                return TRANSACTION;
            default:
                throw new IllegalArgumentException();
        }
    }

    public int getValue() {
        return this.value;
    }
}
