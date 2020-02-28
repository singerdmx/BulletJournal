package com.bulletjournal.time;

import java.sql.Timestamp;
import java.util.concurrent.TimeUnit;

public class IntervalHelper {
    private static final String DELIMITER = " ";
    private static final String MIN_TIME = "0:0:0";
    private static final String MAX_TIME = "23:59:59";

    public static Timestamp getStartTimeByTimezoneOffset(String date, String time, int timezoneOffset) {
        return applyTimezoneOffset(getStartTime(date, time).getTime(), timezoneOffset);
    }

    public static Timestamp getEndTimeByTimezoneOffset(String date, String time, int timezoneOffset) {
        return applyTimezoneOffset(getEndTime(date, time).getTime(), timezoneOffset);
    }

    public static Timestamp applyTimezoneOffset(long time, int timezoneOffset) {
        return new Timestamp(time + TimeUnit.MINUTES.toMillis(timezoneOffset));
    }

    public static Timestamp getStartTime(String date, String time) {
        return time == null ?
                Timestamp.valueOf(getTime(date, MIN_TIME)) : Timestamp.valueOf(getTime(date, time));
    }

    public static Timestamp getEndTime(String date, String time) {
        return time == null ?
                Timestamp.valueOf(getTime(date, MAX_TIME)) : Timestamp.valueOf(getTime(date, time));
    }

    private static String getTime(String date, String time) {
        return date + DELIMITER + time;
    }
}
