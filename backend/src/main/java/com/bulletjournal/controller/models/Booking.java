package com.bulletjournal.controller.models;

import com.google.gson.Gson;

import java.util.Arrays;
import java.util.List;

public class Booking {
    private static final Gson GSON = new Gson();

    private String id;
    private List<Invitee> invitees;
    private int slotIndex;
    private String slotDate;
    private String location;
    private String note;
    private String requesterTimeZone;

    public Booking() {
    }

    public Booking(String id, String invitees, int slotIndex, String slotDate, String location, String note, String requesterTimeZone) {
        this.id = id;
        this.invitees = Arrays.asList(GSON.fromJson(invitees, Invitee[].class));
        this.slotIndex = slotIndex;
        this.slotDate = slotDate;
        this.location = location;
        this.note = note;
        this.requesterTimeZone = requesterTimeZone;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(String slotDate) {
        this.slotDate = slotDate;
    }

    public String getRequesterTimeZone() { return requesterTimeZone; }

    public void setRequesterTimeZone(String requestTimeZone) { this.requesterTimeZone = requestTimeZone; }
}
