package com.bulletjournal.util;

import com.bulletjournal.controller.BookingLinksController;
import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.BookingLink;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.ZonedDateTime;
import java.util.*;

public class BookingUtil {
    private static final Gson GSON = new Gson();
    private static final Logger LOGGER = LoggerFactory.getLogger(BookingLinksController.class);

    public static List<BookingSlot> calculateSlots(
            List<BookingSlot> slotsOverride, String startDate, String endDate, int slotSpan) {
        List<BookingSlot> slots = new ArrayList<>();
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, "America/Chicago");
        ZonedDateTime endTime = ZonedDateTimeHelper.getStartTime(endDate, null, "America/Chicago");
        endTime.plusDays(1);

        if(slotSpan <= 0) return slots;

        int durationMinutes = ZonedDateTimeHelper.getDuration(startTime, endTime);

        int slotsNumber = durationMinutes / slotSpan;

        int totalIndexes = (24 * 60) / slotSpan;

        for(int i = 0; i < slotsNumber; i++){
            BookingSlot bookingSlot = new BookingSlot();
            bookingSlot.setIndex(i % totalIndexes);
            bookingSlot.setDate(ZonedDateTimeHelper.getDate(startTime.plusMinutes(i * slotSpan)));
            bookingSlot.setStartTime(ZonedDateTimeHelper.getTime(startTime.plusMinutes(i * slotSpan)));
            bookingSlot.setEndTime(ZonedDateTimeHelper.getTime(startTime.plusMinutes((i + 1) * slotSpan)));
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
}
