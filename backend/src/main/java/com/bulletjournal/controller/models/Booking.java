package com.bulletjournal.controller.models;

import com.google.gson.Gson;

public class Booking {
    private static final Gson GSON = new Gson();

    private String id;
    private Invitee invitee;
    private int slotIndex;
    private String slotDate;
    private String location;
    private String note;

    public Booking(String id, String invitee, int slotIndex, String slotDate, String location, String note) {
        this.id = id;
        this.invitee = GSON.fromJson(invitee, Invitee.class);
        this.slotIndex = slotIndex;
        this.slotDate = slotDate;
        this.location = location;
        this.note = note;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Invitee getInvitee() {
        return invitee;
    }

    public void setInvitee(Invitee invitee) {
        this.invitee = invitee;
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
}
