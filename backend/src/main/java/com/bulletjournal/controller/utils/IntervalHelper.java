package com.bulletjournal.controller.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class IntervalHelper {
    private static final String DELIMITER = " ";
    private static final String MIN_TIME = "0:0:0";
    private static final String MAX_TIME = "23:59:59";
    private static final String PATTERN = "yyyy-MM-dd HH:mm:ss";

    public static List<ZonedDateTime> getIntervalDateList(ZonedDateTime from, ZonedDateTime to) {
        List<ZonedDateTime> dates = new ArrayList<>();

        ZonedDateTime head = copyZoneDateTime(from);
        ZonedDateTime end = copyZoneDateTime(to);

        while (head != end) {
            dates.add(head);
            head = copyZoneDateTime(head);
            head.plusDays(1);
        }

        return dates;
    }

    private static ZonedDateTime copyZoneDateTime(ZonedDateTime date) {
        return ZonedDateTime.of(date.getYear(),
                date.getMonthValue(),
                date.getDayOfMonth(),
                0,
                0,
                0,
                0,
                date.getZone());
    }

    public static ZonedDateTime getStartTime(String date, String time, String timezone) {
        return time == null ?
                processTime(getDateTime(date, MIN_TIME), timezone) : processTime(getDateTime(date, time), timezone);
    }

    public static ZonedDateTime getEndTime(String date, String time, String timezone) {
        return time == null ?
                processTime(getDateTime(date, MAX_TIME), timezone) : processTime(getDateTime(date, time), timezone);
    }

    private static ZonedDateTime processTime(String dateTime, String timezone) {
        LocalDateTime localDateTime = LocalDateTime.parse(dateTime, DateTimeFormatter.ofPattern(PATTERN));
        return localDateTime.atZone(ZoneId.of(timezone));
    }

    private static String getDateTime(String date, String time) {
        return date + DELIMITER + time;
    }
}
