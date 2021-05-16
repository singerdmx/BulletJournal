package com.bulletjournal.controller.models.params;

import javax.validation.constraints.NotNull;

public class UpdateBookingLinkParams {
    private Integer bufferInMin;

    private Boolean includeTaskWithoutDuration;

    private Boolean expireOnBooking;

    private String startDate;

    private String endDate;

    private Long projectId;

    @NotNull
    private String timezone;

    public UpdateBookingLinkParams() {
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getStartDate() {
        return startDate;
    }

    public boolean hasStartDate() {
        return startDate != null;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public boolean hasEndDate() {
        return endDate != null;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Long getProjectId() {
        return projectId;
    }

    public boolean hasProjectId() {
        return projectId != null;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
