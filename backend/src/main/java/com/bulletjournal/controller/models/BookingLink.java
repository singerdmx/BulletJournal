package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;


import java.util.List;
import java.util.Objects;

public class BookingLink {

    private String uuid;

    @NotNull
    protected String owner;

    private String startDate;

    private String endDate;

    private List<Invitee> invitees;

    private String timezone;

    private boolean includeTaskWithoutDuration;

    private boolean expireOnBooking;

    private List<BookingSlot> slots;

    private int bufferInMin;

    public BookingLink(){

    }

    public BookingLink(String uuid,
                       @NotNull String owner,
                       String startDate,
                       String endDate, int bufferInMin, boolean expireOnBooking, boolean includeTaskWithoutDuration){
        this.uuid = uuid;
        this.owner = owner;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bufferInMin = bufferInMin;
        this.expireOnBooking = expireOnBooking;
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
    }


    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getEndTime() {
        return endDate;
    }

    public void setEndTime(String endDate) {
        this.endDate = endDate;
    }

    public String getStartTime() {
        return startDate;
    }

    public void setStartTime(String startDate) {
        this.startDate = startDate;
    }

    public List<Invitee> getInvitees() {
        return invitees;
    }

    public void setInvitees(List<Invitee> invitees) {
        this.invitees = invitees;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public List<BookingSlot> getSlots() {
        return slots;
    }

    public void setSlots(List<BookingSlot> slots) {
        this.slots = slots;
    }


    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public int getBufferInMin() {
        return bufferInMin;
    }

    public void setBufferInMin(int bufferInMin) {
        this.bufferInMin = bufferInMin;
    }

    @Override
    public boolean equals(Object o){
        if(this == o) return true;
        if(!(o instanceof BookingLink)) return false;
        BookingLink bookingLink = (BookingLink)o;
        return Objects.equals(getSlots(), bookingLink.getSlots()) &&
                java.util.Objects.equals(getUuid(), bookingLink.getUuid());
    }
}
