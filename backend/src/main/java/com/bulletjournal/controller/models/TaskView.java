package com.bulletjournal.controller.models;

import com.bulletjournal.controller.utils.ZonedDateTimeHelper;

import java.time.ZonedDateTime;
import java.util.Objects;

public class TaskView extends Task {

    protected static final int DEFAULT_DURATION_IN_DAYS = 1;

    private Long startTime;

    private Long endTime;

    public TaskView() {
    }

    public TaskView(Task task, Long startTime, Long endTime) {
        this.clone(task);
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public static TaskView getView(Task task) {
        String date = task.getDueDate();
        if (Objects.isNull(date)) {
            return new TaskView(task, null, null);
        }

        String time = task.getDueTime();
        String timezone = task.getTimezone();
        Integer duration = task.getDuration();
        ZonedDateTime start = ZonedDateTimeHelper.getStartTime(date, time, timezone);
        ZonedDateTime end = start;

        if (Objects.isNull(time)) {
            end = start.plusDays(DEFAULT_DURATION_IN_DAYS);
        }
        if (Objects.nonNull(time) && Objects.nonNull(duration)) {
            end = start.plusMinutes(task.getDuration());
        }

        Long startTime = start.toInstant().toEpochMilli();
        Long endTime = end.toInstant().toEpochMilli();
        return new TaskView(task, startTime, endTime);
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }
}
