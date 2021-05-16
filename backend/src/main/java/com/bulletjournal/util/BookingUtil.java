package com.bulletjournal.util;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.BookingLink;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.*;

public class BookingUtil {
    private static final Gson GSON = new Gson();

    public static List<BookingSlot> calculateSlots(
            String timezone,
            List<BookingSlot> slotsOverride,
            String startDate, String endDate, int slotSpan) {
        List<BookingSlot> slots = new ArrayList<>();
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, "America/Chicago");
        ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, "America/Chicago");
        endTime.plusMinutes(1);

        if (slotSpan <= 0) return slots;

        int durationMinutes = (int) Duration.between(startTime, endTime).toMinutes();

        int slotsNumber = durationMinutes / slotSpan;

        int totalIndexes = (24 * 60) / slotSpan;

        for (int i = 0; i < slotsNumber; i++) {
            BookingSlot bookingSlot = new BookingSlot();
            bookingSlot.setIndex(i % totalIndexes);
            bookingSlot.setDate(ZonedDateTimeHelper.getDate(startTime.plusMinutes(i * slotSpan)));
            bookingSlot.setStartTime(ZonedDateTimeHelper.getTime(startTime.plusMinutes(i * slotSpan)));
            bookingSlot.setEndTime(ZonedDateTimeHelper.getTime(startTime.plusMinutes((i + 1) * slotSpan)));

            Optional<BookingSlot> match = slotsOverride.stream().filter(s -> Objects.equals(s, bookingSlot)).findFirst();
            if (match.isPresent()) {
                bookingSlot.setOn(match.get().isOn());
            }
            slots.add(bookingSlot);
        }

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

    public static String toString(List<String> recurrences) {
        return GSON.toJson(recurrences);
    }

    public static List<String> toList(String recurrences) {
        return StringUtils.isBlank(recurrences) ? new ArrayList<>() :
                Arrays.asList(GSON.fromJson(recurrences, String[].class));
    }
}
