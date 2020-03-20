package com.bulletjournal.controller.models;

public class UpdateTaskParams {

    private String assignedTo;

    private String dueDate;

    private String dueTime;

    private String name;

    // In minutes
    private Integer duration;

    private ReminderSetting reminderSetting;

    private String timezone;

    private String recurrenceRule;

    public UpdateTaskParams() {
    }

    public UpdateTaskParams(
            String assignedTo, String dueDate, String dueTime, String name, Integer duration,
            ReminderSetting reminderSetting, String timezone, String recurrenceRule) {
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.name = name;
        this.duration = duration;
        this.reminderSetting = reminderSetting;
        this.timezone = timezone;
        this.recurrenceRule = recurrenceRule;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public boolean hasAssignedTo() {
        return this.assignedTo != null;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public boolean hasDueDate() {
        return this.dueDate != null;
    }

    public boolean needsUpdateDateTime() {
        return this.hasDueDate() || this.hasDueTime() || this.hasTimezone();
    }

    public String getDueTime() {
        return dueTime;
    }

    public void setDueTime(String dueTime) {
        this.dueTime = dueTime;
    }

    public boolean hasDueTime() {
        return this.dueTime != null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean hasTimezone() {
        return this.timezone != null;
    }

    public boolean hasName() {
        return this.name != null;
    }

    public ReminderSetting getReminderSetting() {
        return reminderSetting;
    }

    public void setReminderSetting(ReminderSetting reminderSetting) {
        this.reminderSetting = reminderSetting;
    }

    public boolean hasReminderSetting() {
        return reminderSetting != null;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public boolean hasDuration() {
        return this.duration != null;
    }

    public String getRecurrenceRule() {
        return recurrenceRule;
    }

    public void setRecurrenceRule(String recurrenceRule) {
        this.recurrenceRule = recurrenceRule;
    }

    public String getOrDefaultDate(String defaultDate) {
        return this.hasDueDate() ? this.getDueDate() : defaultDate;
    }

    public String getOrDefaultTime(String defaultTime) {
        return this.hasDueTime() ? this.getDueTime() : defaultTime;
    }

    public String getOrDefaultTimezone(String defaultTimezone) {
        return this.hasTimezone() ? this.getTimezone() : defaultTimezone;
    }
}
