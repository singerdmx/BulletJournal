package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.FrequencyType;
import org.dmfs.rfc5545.DateTime;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.util.TimeZone;

public class ZonedDateTimeHelper {

    public static final String DATE_TIME_DELIMITER = " ";
    public static final String DATE_DELIMITER = "-";
    public static final String DEFAULT_TIME = "00:00";
    public static final String PATTERN = "yyyy-MM-dd HH:mm";
    private static final String MIN_TIME = "00:00";
    private static final String MAX_TIME = "23:59";

    /*
     * Return ZoneDateTime type for start time. If time is null, will replace time with 00:00.
     */
    private static String getDateTime(String date, String time) {
        return date + ZonedDateTimeHelper.DATE_TIME_DELIMITER + time;
    }

    /*
     * Return ZoneDateTime type for start time. If time is null, will replace time with 00:00.
     */
    public static ZonedDateTime getStartTime(String date, String time, String timezone) {
        return time == null ? convertDateTime(getDateTime(date, MIN_TIME), timezone) :
                convertDateTime(getDateTime(date, time), timezone);
    }

    /*
     * Return ZonedDateTime type for start time.
     */
    public static ZonedDateTime getStartTime(FrequencyType frequencyType, String timezone) {
        ZonedDateTime now = getNow(timezone);
        return createStartTime(frequencyType, now);
    }

    /*
     * Return a copy of ZonedDateTime type start date based on the frequency type
     */
    private static ZonedDateTime createStartTime(FrequencyType frequencyType, ZonedDateTime now) {
        ZonedDateTime cloned;
        switch (frequencyType) {
            case MONTHLY:
                int firstDayOfMonth = (int) now.range(ChronoField.DAY_OF_MONTH).getMinimum();
                cloned = now.withDayOfMonth(firstDayOfMonth);
                break;
            case WEEKLY:
                int firstDayOfWeek = (int) now.range(ChronoField.DAY_OF_WEEK).getMinimum();
                cloned = now.minusDays(now.getDayOfWeek().getValue() - firstDayOfWeek);
                break;
            case YEARLY:
                int firstDayOfYear = (int) now.range(ChronoField.DAY_OF_YEAR).getMaximum();
                cloned = now.withDayOfYear(firstDayOfYear);
                break;
            default:
                throw new IllegalArgumentException("");
        }
        int hour = Integer.parseInt(MIN_TIME.split(":")[0]);
        int minute = Integer.parseInt(MIN_TIME.split(":")[1]);
        cloned = cloned.withHour(hour);
        cloned = cloned.withMinute(minute);

        return cloned;
    }

    /*
     * Return ZoneDateTime type for end time. If time is null, will replace time with 23:59.
     */
    public static ZonedDateTime getEndTime(String date, String time, String timezone) {
        return time == null ? convertDateTime(getDateTime(date, MAX_TIME), timezone) :
                convertDateTime(getDateTime(date, time), timezone);
    }

    /*
     * Return ZoneDateTime type for end time.
     */
    public static ZonedDateTime getEndTime(FrequencyType frequencyType, String timezone) {
        ZonedDateTime now = getNow(timezone);
        return createEndTime(frequencyType, now);
    }

    /*
     * Return a copy of ZonedDateTime type end date based on the frequency type
     */
    private static ZonedDateTime createEndTime(FrequencyType frequencyType, ZonedDateTime now) {
        ZonedDateTime cloned;
        switch (frequencyType) {
            case MONTHLY:
                int lastDayOfMonth = (int) now.range(ChronoField.DAY_OF_MONTH).getMaximum();
                cloned = now.withDayOfMonth(lastDayOfMonth);
                break;
            case WEEKLY:
                int lastDayOfWeek = (int) now.range(ChronoField.DAY_OF_WEEK).getMaximum();
                cloned = now.plusDays(lastDayOfWeek - now.getDayOfWeek().getValue());
                break;
            case YEARLY:
                int lastDayOfYear = (int) now.range(ChronoField.DAY_OF_YEAR).getMaximum();
                cloned = now.withDayOfYear(lastDayOfYear);
                break;
            default:
                throw new IllegalArgumentException("");
        }
        int hour = Integer.parseInt(MAX_TIME.split(":")[0]);
        int minute = Integer.parseInt(MAX_TIME.split(":")[1]);
        cloned = cloned.withHour(hour);
        cloned = cloned.withMinute(minute);

        return cloned;
    }

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
        return time == null ? convertDateOnly(date, timezone) :
                convertDateTime(date + DATE_TIME_DELIMITER + time, timezone);
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
     * Convert time and timezone to DateTime
     */
    public static DateTime getDateTime(long time, String timezone) {
        TimeZone convertedTimezone = TimeZone.getTimeZone(timezone);
        return new DateTime(convertedTimezone, time);
    }

    /*
     * Convert ZonedDateTime to DateTime
     */
    public static DateTime getDateTimeFromZonedDateTime(ZonedDateTime zonedDateTime) {
        TimeZone convertedTimezone = TimeZone.getTimeZone(zonedDateTime.getZone());
        return new DateTime(convertedTimezone, zonedDateTime.getLong(ChronoField.INSTANT_SECONDS));
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
        return ZonedDateTime.of(now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth(),
                now.getHour(),
                now.getMinute(),
                0,
                0,
                now.getZone());
    }

    /*
     * 1. Get now ZonedDateTime.
     * 2. Remove second and nano second.
     */
    public static ZonedDateTime getNow(String timezone) {
        ZonedDateTime now = ZonedDateTime.now();
        return ZonedDateTime.of(now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth(),
                now.getHour(),
                now.getMinute(),
                0,
                0,
                ZoneId.of(timezone));
    }
}
