package com.bulletjournal.controller.utils;

import java.time.ZonedDateTime;

public class IntervalHelper {

    private static final String MIN_TIME = "00:00";
    private static final String MAX_TIME = "23:59";

    /*
     * Return ZoneDateTime type for start time. If time is null, will replace time with 00:00.
     */
    public static ZonedDateTime getStartTime(String date, String time, String timezone) {
        return time == null ? ZonedDateTimeHelper.convertDateTime(getDateTime(date, MIN_TIME), timezone) :
                ZonedDateTimeHelper.convertDateTime(getDateTime(date, time), timezone);
    }

    /*
     * Return ZoneDateTime type for end time. If time is null, will replace time with 23:59.
     */
    public static ZonedDateTime getEndTime(String date, String time, String timezone) {
        return time == null ? ZonedDateTimeHelper.convertDateTime(getDateTime(date, MAX_TIME), timezone) :
                ZonedDateTimeHelper.convertDateTime(getDateTime(date, time), timezone);
    }

    private static String getDateTime(String date, String time) {
        return date + ZonedDateTimeHelper.DATE_TIME_DELIMITER + time;
    }
}
