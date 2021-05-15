package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "booking_links")
public class BookingLink {

    @Id
    private String id;

    protected String owner;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    private String slots;

    private String invitees;

    private String timezone;

    @Column(name = "slot_span")
    private int slotSpan;

    @Column(name = "include_task_without_duration")
    private boolean includeTaskWithoutDuration;

    @Column(name = "expire_on_booking")
    private boolean expireOnBooking;

    @Column(name = "buffer_in_min")
    private int bufferInMin;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
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

    public String getInvitees() {
        return invitees;
    }

    public void setInvitees(String invitees) {
        this.invitees = invitees;
    }

    public int getBufferInMin() {
        return bufferInMin;
    }

    public void setBufferInMin(int bufferInMin) {
        this.bufferInMin = bufferInMin;
    }

    public String getSlots() {
        return slots;
    }

    public void setSlots(String slots) {
        this.slots = slots;
    }

    public com.bulletjournal.controller.models.BookingLink toPresentationModel() {
        return null;
    }
}
