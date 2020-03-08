package com.bulletjournal.controller.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class ZonedDateTimeHelper {

    public static final String DATE_TIME_DELIMITER = " ";
    public static final String DATE_DELIMITER = "-";
    public static final String DEFAULT_TIME = "00:00";
    public static final String PATTERN = "yyyy-MM-dd HH:mm";

    /*
     * Convert DateTime String to ZonedDateTime
     */
    public static ZonedDateTime convertDateTime(String dateTime, String timezone) {
        LocalDateTime localDateTime = LocalDateTime.parse(dateTime, DateTimeFormatter.ofPattern(PATTERN));
        return localDateTime.atZone(ZoneId.of(timezone));
    }

    /*
     * Convert Date String to ZonedDateTime
     */
    public static ZonedDateTime convertDateOnly(String date, String timezone) {
        return convertDateTime(date + DATE_TIME_DELIMITER + DEFAULT_TIME, timezone);
    }

    /*
     * Convert Date String to ZonedDateTime
     */
    public static ZonedDateTime convertDateAndTime(String date, String time, String timezone) {
        return convertDateTime(date + DATE_TIME_DELIMITER + time, timezone);
    }

    /*
     * Convert ZonedDateTime to Date String
     */
    public static String getDateFromZoneDateTime(ZonedDateTime zonedDateTime) {
        return zonedDateTime.getYear() + DATE_DELIMITER +
                convertSingleDigitToTwoDigits(zonedDateTime.getMonthValue()) + DATE_DELIMITER +
                convertSingleDigitToTwoDigits(zonedDateTime.getDayOfMonth());
    }

    /*
     * Convert to one digit date to two digits
     */
    public static String convertSingleDigitToTwoDigits(int val) {
        if (val < 10 && val >= 0) {
            return "0" + val;
        }
        return String.valueOf(val);
    }

    /*
     * 1. Get now ZonedDateTime.
     * 2. Remove second and nano second.
     */
    public static ZonedDateTime getNow() {
        ZonedDateTime now = ZonedDateTime.now();
        return  ZonedDateTime.of(now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth(),
                now.getHour(),
                now.getMinute(),
                0,
                0,
                now.getZone());
    }
}
