package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.Invitee;

import java.util.List;

public class BookParams {

    private List<Invitee> invitees;
    private int slotIndex;
    private String slotDate;
    private String startTime;
    private String endTime;
    private String location;
    private String note;
    private String requesterTimezone;
    private String displayDate;

    public BookParams() {
    }

    public BookParams(List<Invitee> invitees, int slotIndex, String slotDate, String location, String note, String requesterTimezone, String startTime, String endTime, String displayDate) {
        this.invitees = invitees;
        this.slotIndex = slotIndex;
        this.slotDate = slotDate;
        this.location = location;
        this.note = note;
        this.requesterTimezone = requesterTimezone;
        this.startTime = startTime;
        this.endTime = endTime;
        this.displayDate = displayDate;
    }

    public List<Invitee> getInvitees() {
        return invitees;
    }

    public void setInvitees(List<Invitee> invitees) {
        this.invitees = invitees;
    }

    public int getSlotIndex() {
        return slotIndex;
    }

    public void setSlotIndex(int slotIndex) {
        this.slotIndex = slotIndex;
    }

    public String getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(String slotDate) {
        this.slotDate = slotDate;
    }

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

    public String getRequesterTimezone() { return requesterTimezone; }

    public void setRequesterTimezone(String requesterTimezone) { this.requesterTimezone = requesterTimezone; }

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

    public String getDisplayDate() {
        return displayDate;
    }

    public void setDisplayDate(String displayDate) {
        this.displayDate = displayDate;
    }
}
