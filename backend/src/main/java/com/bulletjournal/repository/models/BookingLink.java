package com.bulletjournal.repository.models;

import com.google.firebase.database.annotations.NotNull;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name = "booking_links")
public class BookingLink {

    @NotNull
    private String id;

    protected String owner;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

//    private List<Invitee> invitees;

    private String timezone;

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

    public List<Integer> getSlotsON() {
        return slotsON;
    }

    public void setSlotsON(List<Integer> slotsON) {
        this.slotsON = slotsON;
    }

    public List<Integer> getSlotsOff() {
        return slotsOff;
    }

    public void setSlotsOff(List<Integer> slotsOff) {
        this.slotsOff = slotsOff;
    }

    public int getBufferInMin() {
        return bufferInMin;
    }

    public void setBufferInMin(int bufferInMin) {
        this.bufferInMin = bufferInMin;
    }

    @Column(name = "slot_span")
    private int slotSpan;

    @Column(name = "include_task_without_duration")
    private boolean includeTaskWithoutDuration;

    @Column(name = "expire_on_booking")
    private boolean expireOnBooking;

    @Column(name = "slots_on")
    private List<Integer> slotsON;

    @Column(name = "slots_off")
    private List<Integer> slotsOff;

    @Column(name = "buffer_in_min")
    private int bufferInMin;
}
