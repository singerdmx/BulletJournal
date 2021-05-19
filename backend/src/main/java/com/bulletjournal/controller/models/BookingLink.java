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

    private List<Booking> bookings;

    private String timezone;

    private boolean includeTaskWithoutDuration;

    private boolean expireOnBooking;

    private List<BookingSlot> slots;

    private List<RecurringSpan> recurrences;

    private Project project;

    public List<RecurringSpan> getRecurrences() {
        return recurrences;
    }

    public void setRecurrences(List<RecurringSpan> recurrences) {
        this.recurrences = recurrences;
    }

    private int bufferInMin;

    private String location;

    private String note;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public BookingLink() {
    }

    public BookingLink(String id,
                       @NotNull String owner,
                       String startDate,
                       String endDate,
                       int slotSpan,
                       int bufferInMin,
                       String timezone,
                       boolean expireOnBooking,
                       boolean includeTaskWithoutDuration,
                       List<RecurringSpan> recurrences,
                       @NotNull com.bulletjournal.controller.models.Project project,
                       String location,
                       String note) {
        this.id = id;
        this.owner = owner;
        this.startDate = startDate;
        this.endDate = endDate;
        this.slotSpan = slotSpan;
        this.bufferInMin = bufferInMin;
        this.timezone = timezone;
        this.expireOnBooking = expireOnBooking;
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
        this.recurrences = recurrences;
        this.project = project;
        this.location = location;
        this.note = note;
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

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
