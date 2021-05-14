package com.bulletjournal.controller.models;

import java.util.Objects;

public class BookingSlot {
    private boolean isOn;
    private int index;
    private String startTime;
    private String endTime;
    private String date;


    public boolean isOn() {
        return isOn;
    }

    public void setOn(boolean on) {
        isOn = on;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingSlot bookingSlot = (BookingSlot) o;
        return isOn == bookingSlot.isOn &&
                index == bookingSlot.index &&
                Objects.equals(startTime, bookingSlot.startTime) &&
                Objects.equals(endTime, bookingSlot.endTime) &&
                Objects.equals(date, bookingSlot.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(isOn(), getIndex(), getStartTime(), getEndTime(), getDate());
    }
}
