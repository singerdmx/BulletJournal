package com.bulletjournal.util;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.models.RecurringSpan;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.Booking;
import com.bulletjournal.repository.models.BookingLink;
import com.bulletjournal.repository.models.Task;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.StringUtils;
import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class BookingUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(BookingUtil.class);
    private static final Gson GSON = new Gson();
    private static final Gson EXPOSE_GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    public static List<BookingSlot> calculateSlots(
            String timezone, String requestTimezone,
            List<BookingSlot> slotsOverride,
            String startDate, String endDate, int slotSpan, boolean includeTaskWithoutDuration,
            int beforeBuffer, int afterBuffer, List<Task> tasksBetween, String recurrences, List<Booking> bookings) {

        List<RecurringSpan> recurringSpans = toList(recurrences);
        List<Pair<ZonedDateTime, ZonedDateTime>> recurringTimes = new ArrayList<>();
        recurringSpans.forEach(s -> {
                    try {
                        DateTime startDateTime = ZonedDateTimeHelper.getDateTime(ZonedDateTimeHelper.getStartTime(startDate, null, timezone));
                        DateTime endDateTime = ZonedDateTimeHelper.getDateTime(ZonedDateTimeHelper.getEndTime(endDate, null, timezone));
                        String recurrenceRule = s.getRecurrenceRule();
                        BuJoRecurrenceRule rule = new BuJoRecurrenceRule(recurrenceRule, timezone);
                        RecurrenceRuleIterator it = rule.getIterator();
                        while (it.hasNext()) {
                            DateTime currDateTime = it.nextDateTime();
                            if (currDateTime.after(endDateTime)) {
                                break;
                            }
                            if (currDateTime.before(startDateTime)) {
                                continue;
                            }
                            recurringTimes.add(Pair.of(ZonedDateTimeHelper.getZonedDateTime(currDateTime),
                                    ZonedDateTimeHelper.getZonedDateTime(currDateTime).plusMinutes(s.getDuration())));
                        }
                    } catch (InvalidRecurrenceRuleException e) {
                        LOGGER.error("Error parsing recurrence rule: {} in BookingUtil.calculateSlot",
                                e.toString());
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Recurrence rule format invalid");
                    }
                }

        );


        if (!includeTaskWithoutDuration) {
            tasksBetween = tasksBetween.stream().filter(t -> t.hasDuration()).collect(Collectors.toList());
        }
        Map<Task, Pair<ZonedDateTime, ZonedDateTime>> taskTimes = new HashMap<>();
        tasksBetween.forEach(t -> taskTimes.put(t, Pair.of(
                ZonedDateTimeHelper.getDateTimeInDifferentZone(t.getDueDate(), t.getDueTime(), t.getTimezone(), timezone).minusMinutes(beforeBuffer),
                t.hasDuration() ? ZonedDateTimeHelper.getDateTimeInDifferentZone(t.getDueDate(), t.getDueTime(), t.getTimezone(), timezone)
                        .plusMinutes(t.getDuration()).plusMinutes(afterBuffer)
                        : ZonedDateTimeHelper.getDateTimeInDifferentZone(
                        t.getDueDate(), t.getDueTime(), t.getTimezone(), timezone).plusMinutes(slotSpan).plusMinutes(afterBuffer)
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
            int index = i % totalIndexes;

            BookingSlot bookingSlot = new BookingSlot();
            bookingSlot.setIndex(index);
            bookingSlot.setDate(date);
            bookingSlot.setOn(true);

            // display to client
            ZonedDateTime displayStartTime = ZonedDateTimeHelper.getDateTimeInDifferentZone(ZonedDateTimeHelper.getDate(startT),
                    ZonedDateTimeHelper.getTime(startT), timezone, requestTimezone);
            ZonedDateTime displayEndTime = ZonedDateTimeHelper.getDateTimeInDifferentZone(ZonedDateTimeHelper.getDate(endT),
                    ZonedDateTimeHelper.getTime(endT), timezone, requestTimezone);
            bookingSlot.setStartTime(ZonedDateTimeHelper.getTime(displayStartTime));
            bookingSlot.setEndTime(ZonedDateTimeHelper.getTime(displayEndTime));
            bookingSlot.setDisplayDate(ZonedDateTimeHelper.getDate(displayStartTime));


            if (tasksBetween.stream().anyMatch(t -> isBetweenSlot(taskTimes.get(t).getLeft(),
                    taskTimes.get(t).getRight(), startT, endT))) {
                bookingSlot.setOn(false);
            }

            if (recurringTimes.stream().anyMatch(r -> isBetweenSlot(r.getLeft(), r.getRight(), startT, endT))) {
                bookingSlot.setOn(false);
            }

            Optional<BookingSlot> match = slotsOverride.stream().filter(s -> Objects.equals(s, bookingSlot)).findFirst();
            match.ifPresent(slot -> bookingSlot.setOn(slot.isOn()));

            if (bookings != null) {
                Optional<Booking> existingBooking = bookings.stream().filter(
                        b -> b.getSlotIndex() == index && b.getSlotDate().equals(date)).findAny();
                if (existingBooking.isPresent()) {
                    bookingSlot.setBooking(existingBooking.get().toPresentationModel());
                    bookingSlot.setOn(false);
                }
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
                new ArrayList<>(Arrays.asList(EXPOSE_GSON.fromJson(bookingLink.getSlots(), BookingSlot[].class)));
    }

    public static String updateBookingLinkSlot(BookingSlot slotOverride, BookingLink bookingLink) {
        List<BookingSlot> slots = BookingUtil.getBookingLinkSlots(bookingLink);

        Optional<BookingSlot> match = slots.stream().filter(s -> Objects.equals(s, slotOverride)).findFirst();
        if (match.isPresent()) {
            match.get().setOn(slotOverride.isOn());
        } else {
            slots.add(slotOverride);
        }
        return EXPOSE_GSON.toJson(slots);
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
