package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.RecurringSpan;

import java.util.List;

public class CreateBookingLinkParams {

    private String startDate;

    private String endDate;

    private String timezone;

    private int slotSpan;

    private int beforeEventBuffer;

    private int afterEventBuffer;

    private boolean includeTaskWithoutDuration;

    private boolean expireOnBooking;

    private List<RecurringSpan> recurrences;

    private long projectId;

    public CreateBookingLinkParams() {
    }

    public CreateBookingLinkParams(
            String startDate, String endDate, String timezone,
            int slotSpan, int beforeEventBuffer, int afterEventBuffer, boolean includeTaskWithoutDuration,
            boolean expireOnBooking, List<RecurringSpan> recurrences, long projectId) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.timezone = timezone;
        this.slotSpan = slotSpan;
        this.beforeEventBuffer = beforeEventBuffer;
        this.afterEventBuffer = afterEventBuffer;
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
        this.expireOnBooking = expireOnBooking;
        this.recurrences = recurrences;
        this.projectId = projectId;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public int getBeforeEventBuffer() {
        return beforeEventBuffer;
    }

    public void setBeforeEventBuffer(int beforeEventBuffer) {
        this.beforeEventBuffer = beforeEventBuffer;
    }

    public int getAfterEventBuffer() {
        return afterEventBuffer;
    }

    public void setAfterEventBuffer(int afterEventBuffer) {
        this.afterEventBuffer = afterEventBuffer;
    }

    public int getSlotSpan() {
        return slotSpan;
    }

    public void setSlotSpan(int slotSpan) {
        this.slotSpan = slotSpan;
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

    public List<RecurringSpan> getRecurrences() {
        return recurrences;
    }

    public void setRecurrences(List<RecurringSpan> recurrences) {
        this.recurrences = recurrences;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }
}
