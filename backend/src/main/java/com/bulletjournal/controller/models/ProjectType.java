package com.bulletjournal.controller.models;

public enum ProjectType {
    TODO(0),
    NOTE(1),
    LEDGER(2);

    private int value;

    ProjectType(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
