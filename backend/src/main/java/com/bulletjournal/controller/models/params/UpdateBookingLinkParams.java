package com.bulletjournal.controller.models.params;

public class UpdateBookingLinkParams {
    private Integer bufferInMin;

    private Boolean includeTaskWithoutDuration;

    private Boolean expireOnBooking;

    public UpdateBookingLinkParams() {

    }

    public UpdateBookingLinkParams(int bufferInMin, boolean includeTaskWithoutDuration, boolean expireOnBooking) {
        this.bufferInMin = bufferInMin;
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
        this.expireOnBooking = expireOnBooking;
    }

    public int getBufferInMin() {
        return bufferInMin;
    }

    public void setBufferInMin(int bufferInMin) {
        this.bufferInMin = bufferInMin;
    }

    public boolean isIncludeTaskWithoutDuration() {
        return includeTaskWithoutDuration;
    }

    public void setIncludeTaskWithoutDuration(boolean includeTaskWithoutDuration) {
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
    }

    public boolean isExpireOnBooking() {
        return expireOnBooking;
    }

    public void setExpireOnBooking(boolean expireOnBooking) {
        this.expireOnBooking = expireOnBooking;
    }

    public boolean hasBufferInMin() {
        return this.bufferInMin != null;
    }

    public boolean hasIncludeTaskWithoutDuration() {
        return this.includeTaskWithoutDuration != null;
    }

    public boolean hasExpireOnBooking() {
        return this.expireOnBooking != null;
    }
}
