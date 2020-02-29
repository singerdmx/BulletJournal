package com.bulletjournal.controller.models;

/**
 * Enumeration of the days of the week
 */
public enum DayOfWeek {
    SUN(0), MON(1), TUE(2), WED(3), THU(4), FRI(5), SAT(6);

    private int value;

    DayOfWeek(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}

