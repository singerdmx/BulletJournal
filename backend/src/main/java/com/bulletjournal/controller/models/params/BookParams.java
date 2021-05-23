package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.Invitee;

import java.util.List;

public class BookParams {

    private List<Invitee> invitees;
    private int slotIndex;
    private String slotDate;
    private String location;
    private String note;
    private String requesterTimeZone;

    public BookParams() {
    }

    public BookParams(List<Invitee> invitees, int slotIndex, String slotDate, String location, String note, String requesterTimeZone) {
        this.invitees = invitees;
        this.slotIndex = slotIndex;
        this.slotDate = slotDate;
        this.location = location;
        this.note = note;
        this.requesterTimeZone = requesterTimeZone;
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

    public String getRequesterTimeZone() { return requesterTimeZone; }

    public void setRequesterTimeZone(String requesterTimeZone) { this.requesterTimeZone = requesterTimeZone; }
}
