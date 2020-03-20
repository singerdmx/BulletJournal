package com.bulletjournal.controller.models;

import com.bulletjournal.repository.models.Project;
import com.google.gson.annotations.Expose;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Task extends ProjectItem {

    @NotBlank
    @Size(min = 1, max = 100)
    private String assignedTo;

    private String dueDate;

    private String dueTime;

    @NotBlank
    private String timezone;

    // In minutes
    private Integer duration;

    private ReminderSetting reminderSetting;

    private String recurrenceRule;

    @Expose
    @Valid
    private List<Task> subTasks = new ArrayList<>();

    public Task() {
    }

    public Task(Long id,
                @NotBlank @Size(min = 1, max = 100) String assignedTo,
                String dueDate,
                String dueTime,
                @NotBlank String timezone,
                @NotNull String name,
                Integer duration,
                @NotNull Project project,
                List<Label> labels,
                ReminderSetting reminderSetting,
                String recurrenceRule) {
        super(id, name, project, labels);
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.timezone = timezone;
        this.duration = duration;
        if (reminderSetting.hasBefore() || reminderSetting.hasDate()) {
            this.reminderSetting = reminderSetting;
        }
        this.recurrenceRule = recurrenceRule;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
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

    public List<Task> getSubTasks() {
        return subTasks;
    }

    public void setSubTasks(List<Task> subTasks) {
        this.subTasks = subTasks;
    }

    public void addSubTask(Task task) {
        this.subTasks.add(task);
    }

    public String getRecurrenceRule() {
        return recurrenceRule;
    }

    public void setRecurrenceRule(String recurrenceRule) {
        this.recurrenceRule = recurrenceRule;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Task)) return false;
        if (!super.equals(o)) return false;
        Task task = (Task) o;
        return Objects.equals(getAssignedTo(), task.getAssignedTo()) &&
                Objects.equals(getDueDate(), task.getDueDate()) &&
                Objects.equals(getDueTime(), task.getDueTime()) &&
                Objects.equals(getTimezone(), task.getTimezone()) &&
                Objects.equals(getDuration(), task.getDuration()) &&
                Objects.equals(getReminderSetting(), task.getReminderSetting()) &&
                Objects.equals(getRecurrenceRule(), task.getRecurrenceRule()) &&
                Objects.equals(getSubTasks(), task.getSubTasks());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getAssignedTo(), getDueDate(), getDueTime(), getTimezone(), getDuration(), getReminderSetting(), getRecurrenceRule(), getSubTasks());
    }

    public void clone(Task task) {
        super.clone(task);
        this.setAssignedTo(task.getAssignedTo());
        this.setDueDate(task.getDueDate());
        this.setDueTime(task.getDueTime());
        this.setTimezone(task.getTimezone());
        this.setDuration(task.getDuration());
        if (task.hasReminderSetting() &&
                (task.getReminderSetting().hasBefore() || task.getReminderSetting().hasDate())) {
            this.setReminderSetting(task.getReminderSetting());
        }
        this.setRecurrenceRule(task.getRecurrenceRule());
    }
}
