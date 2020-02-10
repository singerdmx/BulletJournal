package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class Time {
    private static final int MINUTES_IN_HOUR = 60;
    private static final int HOURS_A_DAY = 24;
    private static final int MINUTES_A_DAY = MINUTES_IN_HOUR * HOURS_A_DAY;

    @NotNull
    @Size(min = 0, max = 23)
    private Integer hour;

    @NotNull
    @Size(min = 0, max = 59)
    private Integer minute;

    public Time() {
    }

    public Time(@NotNull @Size(min = 0, max = 23) Integer hour,
                @NotNull @Size(min = 0, max = 59) Integer minute) {
        this.hour = hour;
        this.minute = minute;
    }

    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public Integer getMinute() {
        return minute;
    }

    public void setMinute(Integer minute) {
        this.minute = minute;
    }

    public static Time getFromMinutes(int minutesInDay) {
        if (!isMinutesInDayValid(minutesInDay)) {
            throw new IllegalArgumentException();
        }

        int hour = minutesInDay / MINUTES_IN_HOUR;
        int minute = minutesInDay % MINUTES_IN_HOUR;
        return new Time(hour, minute);
    }

    public static boolean isMinutesInDayValid(final int minuteValue) {
        return minuteValue >= 0 && minuteValue <= MINUTES_A_DAY;
    }
}