package com.bulletjournal.controller.models;

import com.google.gson.annotations.Expose;

import java.util.Objects;

public class BookingSlot {
    @Expose
    private boolean isOn;
    @Expose
    private int index;
    @Expose
    private String date;
    private String startTime;
    private String endTime;
    private String displayDate;
    private Booking booking;

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

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

    public String getDisplayDate() {
        return displayDate;
    }

    public void setDisplayDate(String displayDate) {
        this.displayDate = displayDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingSlot bookingSlot = (BookingSlot) o;
        return index == bookingSlot.index &&
                Objects.equals(date, bookingSlot.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getIndex(), getDate());
    }
}
