package com.bulletjournal.util;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.repository.models.BookingLink;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;

import java.util.*;

public class BookingUtil {
    private static final Gson GSON = new Gson();

    public static List<BookingSlot> calculateSlots(
            List<BookingSlot> slotsOverride, String startDate, String endDate, int slotSpan) {
        List<BookingSlot> slots = new ArrayList<>();
        return slots;
    }

    public static List<BookingSlot> getBookingLinkSlots(BookingLink bookingLink) {
        return StringUtils.isBlank(bookingLink.getSlots()) ? new ArrayList<>() :
                Arrays.asList(GSON.fromJson(bookingLink.getSlots(), BookingSlot[].class));
    }

    public static String updateBookingLinkSlot(BookingSlot slotOverride, BookingLink bookingLink) {
        List<BookingSlot> slots = BookingUtil.getBookingLinkSlots(bookingLink);

        Optional<BookingSlot> match = slots.stream().filter(s -> Objects.equals(s, slotOverride)).findFirst();
        if (match.isPresent()) {
            match.get().setOn(slotOverride.isOn());
        } else {
            slots.add(slotOverride);
        }
        return GSON.toJson(slots);
    }
}
