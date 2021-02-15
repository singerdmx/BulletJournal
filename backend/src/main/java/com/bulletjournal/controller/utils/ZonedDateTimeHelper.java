package com.bulletjournal.controller.utils;

import com.bulletjournal.ledger.FrequencyType;
import org.apache.commons.lang3.StringUtils;
import org.dmfs.rfc5545.DateTime;
import org.springframework.data.util.Pair;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class ZonedDateTimeHelper {

    public static final String DATE_TIME_DELIMITER = " ";
    public static final String DATE_DELIMITER = "-";
    public static final String TIME_DELIMITER = ":";
    public static final String DEFAULT_TIME = "00:00";
    public static final String PATTERN = "yyyy-MM-dd HH:mm";
    public static final int MAX_HOURS_BEFORE = 2;
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final String MIN_TIME = "00:00";
    private static final String MAX_TIME = "23:59";

    public static String toDBTimestamp(ZonedDateTime zonedDateTime) {
        String res = Timestamp.from(zonedDateTime.toInstant()).toString();
        return res.substring(0, res.lastIndexOf('.'));
    }

    /**
     * Aggregate hour and time to a single string
     */
    private static String aggregateTime(int hour, int min) {
        return convertSingleDigitToTwoDigits(hour) + TIME_DELIMITER + convertSingleDigitToTwoDigits(min);
    }

    /**
     * Aggregate year, month and day to a single string
     */
    private static String aggregateDate(int year, int month, int day) {
        return year + DATE_DELIMITER +
                convertSingleDigitToTwoDigits(month) + DATE_DELIMITER +
                convertSingleDigitToTwoDigits(day);
    }

    /**
     * Return ZoneDateTime type for start time. If time is null, will replace time with 00:00.
     */
    private static String getDateTime(String date, String time) {
        return date + DATE_TIME_DELIMITER + time;
    }

    /**
     * Return Timestamp type from ZonedDateTime
     */
    public static Timestamp getTimestamp(ZonedDateTime dateTime) {
        return Timestamp.from(dateTime.toInstant());
    }


    /**
     * Return ZonedDateTime from Timestamp and timezone
     */
    public static ZonedDateTime getZonedDateTime(long timestampSecond, String timezone) {
        return ZonedDateTime.ofInstant(Instant.ofEpochSecond(timestampSecond), ZoneId.of(timezone));
    }

    /**
     * Return ZoneDateTime type for start time. If time is null, will replace time with 00:00.
     */
    public static ZonedDateTime getStartTime(String date, String time, String timezone) {
        return time == null ? convertDateTime(getDateTime(date, MIN_TIME), timezone) :
                convertDateTime(getDateTime(date, time), timezone);
    }

    /**
     * Return ZonedDateTime type for start time.
     */
    public static ZonedDateTime getStartTime(FrequencyType frequencyType, String timezone) {
        ZonedDateTime now = getNow(timezone);
        return createStartTime(frequencyType, now);
    }

    /**
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
                int firstDayOfYear = (int) now.range(ChronoField.DAY_OF_YEAR).getMinimum();
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

    /**
     * Return ZoneDateTime type for end time. If time is null, will replace time with 23:59.
     */
    public static ZonedDateTime getEndTime(String date, String time, String timezone) {
        return time == null ? convertDateTime(getDateTime(date, MAX_TIME), timezone) :
                convertDateTime(getDateTime(date, time), timezone);
    }

    /**
     * Return ZoneDateTime type for end time.
     */
    public static ZonedDateTime getEndTime(FrequencyType frequencyType, String timezone) {
        ZonedDateTime now = getNow(timezone);
        return createEndTime(frequencyType, now);
    }

    /**
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

    /**
     * Convert DateTime String to ZonedDateTime
     */
    public static ZonedDateTime convertDateTime(String dateTime, String timezone) {
        LocalDateTime localDateTime = LocalDateTime.parse(dateTime, DateTimeFormatter.ofPattern(PATTERN));
        return localDateTime.atZone(ZoneId.of(timezone));
    }

    /**
     * Convert Date String to ZonedDateTime
     */
    public static ZonedDateTime convertDateOnly(String date, String timezone) {
        return convertDateTime(date + DATE_TIME_DELIMITER + DEFAULT_TIME, timezone);
    }

    /**
     * Convert Date and Time String to ZonedDateTime
     */
    public static ZonedDateTime convertDateAndTime(String date, String time, String timezone) {
        return time == null ? convertDateOnly(date, timezone) :
                convertDateTime(date + DATE_TIME_DELIMITER + time, timezone);
    }


    /**
     * Convert Date and Time String to ZonedDateTime and shift timezone
     */
    public static ZonedDateTime getDateInDifferentZone(String date, String time, String fromZone, String toZone) {
        return convertDateAndTime(date, time, fromZone)
                .withZoneSameInstant(ZoneId.of(toZone))
                .withHour(0)
                .withMinute(0);
    }

    /**
     * Convert ZonedDateTime to Date String
     */
    public static String getDate(ZonedDateTime dateTime) {
        return aggregateDate(dateTime.getYear(), dateTime.getMonthValue(), dateTime.getDayOfMonth());
    }

    /**
     * Convert ZonedDateTime to Date String
     */
    public static String getTime(ZonedDateTime dateTime) {
        return aggregateTime(dateTime.getHour(), dateTime.getMinute());
    }

    /**
     * Convert time and timezone to DateTime
     */
    public static DateTime getDateTime(long time, String timezone) {
        TimeZone convertedTimezone = TimeZone.getTimeZone(timezone);
        return new DateTime(convertedTimezone, time);
    }

    /**
     * Get ZonedDateTime from rfc5545 Datetime
     */
    public static ZonedDateTime getZonedDateTime(DateTime dateTime) {
        ZoneId zonedId = dateTime.getTimeZone().toZoneId();
        return ZonedDateTime.ofInstant(Instant.ofEpochMilli(dateTime.getTimestamp()), zonedId);
    }

    /**
     * Convert ZonedDateTime to DateTime
     */
    public static DateTime getDateTime(ZonedDateTime zonedDateTime) {
        TimeZone convertedTimezone = TimeZone.getTimeZone(zonedDateTime.getZone());
        return new DateTime(convertedTimezone, zonedDateTime.getLong(ChronoField.INSTANT_SECONDS) * 1000);
    }

    /**
     * Get Date from rfc5455 DateTime with format yyyy-mm-dd
     */
    public static String getDate(DateTime dateTime) {
        return getDate(getZonedDateTime(dateTime));
    }

    /**
     * Get Time from rfc5455 DateTime with format hh:mm
     */
    public static String getTime(DateTime dateTime) {
        return getTime(getZonedDateTime(dateTime));
    }

    /**
     * Convert to one digit date to two digits
     */
    public static String convertSingleDigitToTwoDigits(int val) {
        if (val < 10 && val >= 0) {
            return "0" + val;
        }
        return String.valueOf(val);
    }

    /**
     * Parse DateTime set string to a set of DateTime
     *
     * @param string the string of the completed slots list. Each slot is splitted by comma.
     *               Format: slot1,slot2,slot3
     * @return Set<String> - a set of Date Time
     */
    public static Set<String> parseDateTimeSet(String string) {
        Set<String> targetSet = new HashSet<>();
        if (StringUtils.isBlank(string)) {
            return targetSet;
        }
        targetSet.addAll(Arrays.asList(string.split(",")));
        return targetSet;
    }

    /**
     * Parse DateTime set string to a set of DateTime
     *
     * @param string the string of the completed slots list. Each slot is splitted by comma.
     *               Format: slot1,slot2,slot3
     * @return List<String> - a list of Date Time
     */
    public static List<DateTime> parseDateTimeList(String string) {
        List<DateTime> targetList = new ArrayList<>();
        if (StringUtils.isNoneEmpty(string) || StringUtils.isEmpty(string))
            return targetList;
        for (String s : string.split(",")) {
            targetList.add(DateTime.parse(s));
        }
        return targetList;
    }


    /**
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

    /**
     * 1. Get now ZonedDateTime.
     * 2. Remove second and nano second.
     */
    public static ZonedDateTime getNow(String timezone) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(timezone));
        return ZonedDateTime.of(now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth(),
                now.getHour(),
                now.getMinute(),
                0,
                0,
                ZoneId.of(timezone));
    }

    public static long getPassedSecondsOfDay(String timezone) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(timezone));
        return now.get(ChronoField.SECOND_OF_DAY);
    }

    public static Pair<ZonedDateTime, ZonedDateTime> getInterval(long seconds, String timezone) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(timezone));
        return Pair.of(now.minus(seconds, ChronoUnit.SECONDS), now.plus(seconds, ChronoUnit.SECONDS));
    }

}
