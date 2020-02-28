package com.bulletjournal.controller.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class IntervalHelper {
    private static final String DELIMITER = " ";
    private static final String MIN_TIME = "0:0:0";
    private static final String MAX_TIME = "23:59:59";
    private static final String PATTERN = "yyyy-MM-dd HH:mm:ss";


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
