package com.bulletjournal.controller.models;

import com.sun.istack.NotNull;

public class ZonedDateTimeParam {

    @NotNull
    private String dateTime;

    @NotNull
    private String timezone;

    public ZonedDateTimeParam(String dateTime, String timezone) {
        this.dateTime = dateTime;
        this.timezone = timezone;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean hasDateTime() {
        return dateTime != null;
    }

    public boolean hasTimezone() {
        return timezone != null;
    }
}
