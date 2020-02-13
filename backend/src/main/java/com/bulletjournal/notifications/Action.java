package com.bulletjournal.notifications;

public enum Action {

    ACCEPT("Accept"), DECLINE("Decline");

    private final String description;

    Action(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}
