package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.BookingSlot;

import java.util.List;

public class UpdateBookingLinkSlotParams {
    private int slotIndex;
    private boolean isOn;

    public UpdateBookingLinkSlotParams(int slotIndex, boolean isOn) {
        this.slotIndex = slotIndex;
        this.isOn = isOn;
    }

    public UpdateBookingLinkSlotParams() {
    }

    public int getSlotIndex() {
        return slotIndex;
    }

    public void setSlotIndex(int slotIndex) {
        this.slotIndex = slotIndex;
    }

    public boolean isOn() {
        return isOn;
    }

    public void setOn(boolean on) {
        isOn = on;
    }
}
