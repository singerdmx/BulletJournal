package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.BookingSlot;

public class UpdateBookingLinkSlotParams {
    private BookingSlot bookingSlot;
    private String timezone;

    public BookingSlot getBookingSlot() {
        return bookingSlot;
    }

    public void setBookingSlot(BookingSlot bookingSlot) {
        this.bookingSlot = bookingSlot;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}
