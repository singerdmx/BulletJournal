package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Objects;

public class ReminderSetting {

    @NotBlank
    @Size(min = 10, max = 10)
    private String date; // "yyyy-MM-dd"

    @NotBlank
    @Size(min = 5, max = 5)
    private String time; // "HH-mm"

    private Integer before;

    public ReminderSetting() {
    }

    public ReminderSetting(
            @Size(min = 10, max = 10) String date,
            @Size(min = 5, max = 5) String time,
            Integer before) {
        this.date = date;
        this.time = time;
        this.before = before;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean hasDate() {
        return this.date != null;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean hasTime() {
        return this.time != null;
    }

    public Integer getBefore() {
        return before;
    }

    public void setBefore(Integer before) {
        this.before = before;
    }

    public boolean hasBefore() {
        return this.before != null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReminderSetting)) return false;
        ReminderSetting that = (ReminderSetting) o;
        return Objects.equals(getDate(), that.getDate()) &&
                Objects.equals(getTime(), that.getTime()) &&
                Objects.equals(getBefore(), that.getBefore());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getDate(), getTime(), getBefore());
    }
}
