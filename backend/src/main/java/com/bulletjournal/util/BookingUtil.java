package com.bulletjournal.util;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.models.RecurringSpan;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.BookingLink;
import com.bulletjournal.repository.models.Task;
import com.google.gson.Gson;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.StringUtils;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class BookingUtil {
    private static final Gson GSON = new Gson();

    public static List<BookingSlot> calculateSlots(
            String timezone,
            List<BookingSlot> slotsOverride,
            String startDate, String endDate, int slotSpan, boolean includeTaskWithoutDuration,
            int bufferInMin, List<Task> tasksBetween) {

        if (!includeTaskWithoutDuration) {
            tasksBetween = tasksBetween.stream().filter(t -> t.hasDuration()).collect(Collectors.toList());
        }
        Map<Task, Pair<ZonedDateTime, ZonedDateTime>> taskTimes = new HashMap<>();
        tasksBetween.forEach(t -> taskTimes.put(t, Pair.of(
                ZonedDateTimeHelper.convertDateAndTime(t.getDueDate(), t.getDueTime(), t.getTimezone()).minusMinutes(bufferInMin),
                t.hasDuration() ? ZonedDateTimeHelper.convertDateAndTime(t.getDueDate(), t.getDueTime(), t.getTimezone())
                        .plusMinutes(t.getDuration()).plusMinutes(bufferInMin)
                        : ZonedDateTimeHelper.convertDateAndTime(
                        t.getDueDate(), t.getDueTime(), t.getTimezone()).plusMinutes(slotSpan).plusMinutes(bufferInMin)
        )));

        List<BookingSlot> slots = new ArrayList<>();
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
        ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);
        endTime.plusMinutes(1);

        if (slotSpan <= 0) return slots;

        int durationMinutes = (int) Duration.between(startTime, endTime).toMinutes();

        int slotsNumber = durationMinutes / slotSpan;

        int totalIndexes = (24 * 60) / slotSpan;

        for (int i = 0; i < slotsNumber; i++) {
            ZonedDateTime startT = startTime.plusMinutes(i * slotSpan);
            ZonedDateTime endT = startTime.plusMinutes((i + 1) * slotSpan);
            String date = ZonedDateTimeHelper.getDate(startT);

            BookingSlot bookingSlot = new BookingSlot();
            bookingSlot.setIndex(i % totalIndexes);
            bookingSlot.setDate(date);
            bookingSlot.setStartTime(ZonedDateTimeHelper.getTime(startT));
            bookingSlot.setEndTime(ZonedDateTimeHelper.getTime(endT));

            Optional<Task> task = tasksBetween.stream().filter(t -> isBetweenSlot(taskTimes.get(t).getLeft(),
                    taskTimes.get(t).getRight(), startT, endT)).findFirst();

            if (task.isPresent()) {
                bookingSlot.setOn(false);
            }

            Optional<BookingSlot> match = slotsOverride.stream().filter(s -> Objects.equals(s, bookingSlot)).findFirst();
            if (match.isPresent()) {
                bookingSlot.setOn(match.get().isOn());
            }
            slots.add(bookingSlot);
        }

        return slots;
    }

    private static boolean isBetweenSlot(ZonedDateTime startTime, ZonedDateTime endTime, ZonedDateTime startT, ZonedDateTime endT) {
        return startTime.compareTo(endT) < 0 && endTime.compareTo(startT) > 0;
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

    public static String toString(List<RecurringSpan> recurrences) {
        if (recurrences == null) {
            recurrences = Collections.emptyList();
        }
        return GSON.toJson(recurrences);
    }

    public static List<RecurringSpan> toList(String recurrences) {
        return StringUtils.isBlank(recurrences) ? new ArrayList<>() :
                Arrays.asList(GSON.fromJson(recurrences, RecurringSpan[].class));
    }
}
