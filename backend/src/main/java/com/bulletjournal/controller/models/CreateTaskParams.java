package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Collections;
import java.util.List;

public class CreateTaskParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    private String dueDate; // "yyyy-MM-dd"

    private String dueTime; // "HH:mm"

    // In minutes
    private Integer duration;

    private ReminderSetting reminderSetting;

    private List<String> assignees;

    private List<Long> labels;

    @NotBlank
    @Size(min = 1, max = 100)
    private String timezone;

    private String recurrenceRule;

    private String location;

    public CreateTaskParams() {
    }

    public CreateTaskParams(
            @NotBlank @Size(min = 1, max = 100) String name, String dueDate, String dueTime,
            Integer duration, ReminderSetting reminderSetting, List<String> assignees,
            @NotBlank @Size(min = 1, max = 100) String timezone, String recurrenceRule) {
        this(name, dueDate, dueTime, duration, reminderSetting, assignees, timezone, recurrenceRule, Collections.emptyList());
    }

    public CreateTaskParams(
            @NotBlank @Size(min = 1, max = 100) String name, String dueDate, String dueTime,
            Integer duration, ReminderSetting reminderSetting, List<String> assignees,
            @NotBlank @Size(min = 1, max = 100) String timezone, String recurrenceRule, List<Long> labels) {
        this(name, dueDate, dueTime, duration, reminderSetting, assignees, timezone, recurrenceRule, labels, null);
    }

    public CreateTaskParams(
            @NotBlank @Size(min = 1, max = 100) String name, String dueDate, String dueTime,
            Integer duration, ReminderSetting reminderSetting, List<String> assignees,
            @NotBlank @Size(min = 1, max = 100) String timezone, String recurrenceRule, List<Long> labels, String location) {
        this.name = name;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
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

    public String getDueTime() {
        return dueTime;
    }

    public void setDueTime(String dueTime) {
        this.dueTime = dueTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ReminderSetting getReminderSetting() {
        return reminderSetting;
    }

    public void setReminderSetting(ReminderSetting reminderSetting) {
        this.reminderSetting = reminderSetting;
    }

    public boolean hasReminderSetting() {
        return this.reminderSetting != null;
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
