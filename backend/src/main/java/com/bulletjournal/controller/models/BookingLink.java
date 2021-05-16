package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;
import java.util.List;

public class BookingLink {

    private String id;

    @NotNull
    protected String owner;

    private String startDate;

    private String endDate;

    private int slotSpan;

    private Invitee invitee;

    private List<Invitee> guests;

    private String timezone;

    private boolean includeTaskWithoutDuration;

    private boolean expireOnBooking;

    private List<BookingSlot> slots;

    private List<String> recurrences;

    public List<String> getRecurrences() {
        return recurrences;
    }

    public void setRecurrences(List<String> recurrences) {
        this.recurrences = recurrences;
    }

    private int bufferInMin;

    public BookingLink() {
    }

    public BookingLink(String id,
                       @NotNull String owner,
                       String startDate,
                       String endDate,
                       int slotSpan,
                       int bufferInMin,
                       boolean expireOnBooking,
                       boolean includeTaskWithoutDuration,
                       List<String> recurrences) {
        this.id = id;
        this.owner = owner;
        this.startDate = startDate;
        this.endDate = endDate;
        this.slotSpan = slotSpan;
        this.bufferInMin = bufferInMin;
        this.expireOnBooking = expireOnBooking;
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
        this.recurrences = recurrences;
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

    public int getSlotSpan() {
        return slotSpan;
    }

    public void setSlotSpan(int slotSpan) {
        this.slotSpan = slotSpan;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getId() {
        return id;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public boolean isIncludeTaskWithoutDuration() {
        return includeTaskWithoutDuration;
    }

    public boolean isExpireOnBooking() {
        return expireOnBooking;
    }

    public List<BookingSlot> getSlots() {
        return slots;
    }

    public void setSlots(List<BookingSlot> slots) {
        this.slots = slots;
    }


    public void setId(String id) {
        this.id = id;
    }


    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public void setIncludeTaskWithoutDuration(boolean includeTaskWithoutDuration) {
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
    }

    public void setExpireOnBooking(boolean expireOnBooking) {
        this.expireOnBooking = expireOnBooking;
    }

    public int getBufferInMin() {
        return bufferInMin;
    }

    public void setBufferInMin(int bufferInMin) {
        this.bufferInMin = bufferInMin;
    }

    public Invitee getInvitee() {
        return invitee;
    }

    public void setInvitee(Invitee invitee) {
        this.invitee = invitee;
    }

    public List<Invitee> getGuests() {
        return guests;
    }

    public void setGuests(List<Invitee> guests) {
        this.guests = guests;
    }
}
