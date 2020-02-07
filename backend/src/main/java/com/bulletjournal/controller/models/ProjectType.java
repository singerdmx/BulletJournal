package com.bulletjournal.controller.models;

public enum ProjectType {
    TODO(0),
    NOTE(1),
    LEDGER(2);

    private final int value;

    ProjectType(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }

    public static ProjectType getType(int type) {
        switch (type) {
            case 0:
                return TODO;
            case 1:
                return NOTE;
            case 2:
                return LEDGER;
            default:
                throw new IllegalArgumentException();
        }
    }
}
