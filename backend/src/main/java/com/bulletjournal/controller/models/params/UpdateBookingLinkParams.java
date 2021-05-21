package com.bulletjournal.controller.models.params;

import javax.validation.constraints.NotNull;

public class UpdateBookingLinkParams {
    private Integer beforeEventBuffer;

    private Integer afterEventBuffer;

    private Boolean includeTaskWithoutDuration;

    private Boolean expireOnBooking;

    private String note;

    private String location;

    private String startDate;

    private String endDate;

    private Long projectId;

    @NotNull
    private String timezone;

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public boolean hasNote() {
        return this.note != null;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean hasLocation() {
        return this.location != null;
    }

    public UpdateBookingLinkParams() {
    }

    public Integer getBeforeEventBuffer() {
        return beforeEventBuffer;
    }

    public void setBeforeEventBuffer(Integer beforeEventBuffer) {
        this.beforeEventBuffer = beforeEventBuffer;
    }

    public Integer getAfterEventBuffer() {
        return afterEventBuffer;
    }

    public void setAfterEventBuffer(Integer afterEventBuffer) {
        this.afterEventBuffer = afterEventBuffer;
    }

    public boolean hasBeforeEventBuffer() {
        return this.beforeEventBuffer != null;
    }

    public boolean hasAfterEventBuffer() {
        return this.afterEventBuffer != null;
    }

    public boolean hasIncludeTaskWithoutDuration() {
        return this.includeTaskWithoutDuration != null;
    }

    public boolean hasExpireOnBooking() {
        return this.expireOnBooking != null;
    }

    public boolean hasStartDate() {
        return this.startDate != null;
    }

    public boolean hasEndDate() {
        return this.endDate != null;
    }

    public Boolean getIncludeTaskWithoutDuration() {
        return includeTaskWithoutDuration;
    }

    public void setIncludeTaskWithoutDuration(Boolean includeTaskWithoutDuration) {
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
    }

    public Boolean getExpireOnBooking() {
        return expireOnBooking;
    }

    public void setExpireOnBooking(Boolean expireOnBooking) {
        this.expireOnBooking = expireOnBooking;
    }

    public String getStartDate() {
        return startDate;
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

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}
