package com.bulletjournal.controller.models;

public class UpdateTaskParams {

    private String assignedTo;

    private String dueDate;

    private String dueTime;

    private String name;

    private ReminderSetting reminderSetting;

    public UpdateTaskParams() {
    }

    public UpdateTaskParams(
            String assignedTo, String dueDate, String dueTime, String name, ReminderSetting reminderSetting) {
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.name = name;
        this.reminderSetting = reminderSetting;
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
}
