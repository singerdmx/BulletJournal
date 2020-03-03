package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateTaskParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    private String dueDate; // "yyyy-MM-dd"

    private String dueTime; // "HH-mm"

    // In minutes
    private Integer duration;

    private ReminderSetting reminderSetting;

    private String timezone;

    public CreateTaskParams() {
    }

    public CreateTaskParams(@NotBlank @Size(min = 1, max = 100) String name,
                            String dueDate,
                            String dueTime,
                            Integer duration,
                            ReminderSetting reminderSetting,
                            String timezone) {
        this.name = name;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.duration = duration;
        this.reminderSetting = reminderSetting;
        this.timezone = timezone;
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}
