package com.bulletjournal.controller.models;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class UpdateTaskParams {

    private String dueDate;

    private String dueTime;

    private String name;

    // In minutes
    private Integer duration;

    private ReminderSetting reminderSetting;

    private String timezone;

    private String recurrenceRule;

    private List<String> assignees;

    private List<Long> labels;

    private String location;

    public UpdateTaskParams() {
    }

    public UpdateTaskParams(String dueDate, String dueTime, String name, Integer duration,
            ReminderSetting reminderSetting, List<String> assignees, String timezone, String recurrenceRule,
            List<Long> labels) {
        this(dueDate, dueTime, name, duration, reminderSetting, assignees, timezone, recurrenceRule, labels, null);
    }

    public UpdateTaskParams(String dueDate, String dueTime, String name, Integer duration,
                            ReminderSetting reminderSetting, List<String> assignees, String timezone, String recurrenceRule,
                            List<Long> labels, String location) {
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.name = name;
        this.duration = duration;
        this.reminderSetting = reminderSetting;
        this.assignees = assignees;
        this.timezone = timezone;
        this.recurrenceRule = recurrenceRule;
        this.labels = labels;
        this.location = location;
    }

    public void selfClean() {
        if (this.recurrenceRule != null) {
            this.dueDate = null;
            this.dueTime = null;
        }
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
        return StringUtils.isNotBlank(this.name);
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

    public boolean hasRecurrenceRule() {
        return this.recurrenceRule != null;
    }

    public List<String> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }

    public List<Long> getLabels() {
        return labels;
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels;
    }

    public boolean hasLabels() {
        return this.labels != null;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean hasLocation() { return this.location != null; }
}
