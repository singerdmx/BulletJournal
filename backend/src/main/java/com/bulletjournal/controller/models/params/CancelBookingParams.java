package com.bulletjournal.controller.models.params;

public class CancelBookingParams {
    private String name;

    public CancelBookingParams() {
    }

    public CancelBookingParams(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
