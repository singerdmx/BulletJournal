package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.BookingSlot;

import java.util.List;

public class UpdateBookingLinkSlotParams {
    private List<BookingSlot> slots;

    public UpdateBookingLinkSlotParams(List<BookingSlot> slots) {
        this.slots = slots;
    }

    public UpdateBookingLinkSlotParams() {
    }

    public List<BookingSlot> getSlots() {
        return slots;
    }

    public void setSlots(List<BookingSlot> slots) {
        this.slots = slots;
    }
}
