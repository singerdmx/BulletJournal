package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Before {

    ZERO_MIN_BEFORE(0, "0 minute before"),
    FIVE_MIN_BEFORE(1, "5 minutes before"),
    TEN_MIN_BEFORE(2, "10 minutes before"),
    THIRTY_MIN_BEFORE(3, "30 minutes before"),
    ONE_HR_BEFORE(4, "1 hour before"),
    TWO_HR_BEFORE(5, "2 hours before"),
    NONE(6, "No reminder");

    private final int value;

    private final String text;

    Before(int value, String text) {
        this.value = value;
        this.text = text;
    }

    public static Before getType(int type) {
        switch (type) {
            case 0:
                return ZERO_MIN_BEFORE;
            case 1:
                return FIVE_MIN_BEFORE;
            case 2:
                return TEN_MIN_BEFORE;
            case 3:
                return THIRTY_MIN_BEFORE;
            case 4:
                return ONE_HR_BEFORE;
            case 5:
                return TWO_HR_BEFORE;
            case 6:
                return NONE;
            default:
                throw new IllegalArgumentException();
        }
    }

    public int getValue() {
        return this.value;
    }

    public String getText() {
        return this.text;
    }
}
