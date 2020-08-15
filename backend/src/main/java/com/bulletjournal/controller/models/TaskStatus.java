package com.bulletjournal.controller.models;

public enum TaskStatus {
    IN_PROGRESS(0), NEXT_TO_DO(1), READY(2), ON_HOLD(3);

    private final int value;

    TaskStatus(int value) {
        this.value = value;
    }

    public static TaskStatus getType(int type) {
        switch (type) {
            case 0:
                return IN_PROGRESS;
            case 1:
                return NEXT_TO_DO;
            case 2:
                return READY;
            case 3:
                return ON_HOLD;
            default:
                throw new IllegalArgumentException();
        }
    }

    public static String toText(TaskStatus status) {
        if (status == null) {
            return "NONE";
        }
        switch (status) {
            case IN_PROGRESS:
                return "IN PROGRESS";
            case NEXT_TO_DO:
                return "NEXT TO DO";
            case ON_HOLD:
                return "ON HOLD";
            case READY:
                return "READY";
            default:
                throw new IllegalArgumentException();
        }
    }

    public int getValue() {
        return value;
    }
}