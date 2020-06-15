package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Project;
import com.google.gson.annotations.Expose;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Task extends ProjectItem {

    private List<User> assignees = new ArrayList<>();

    private String dueDate;

    private String dueTime;

    @NotBlank
    private String timezone;

    // In minutes
    private Integer duration;

    private ReminderSetting reminderSetting;

    private String recurrenceRule;

    private TaskStatus status;

    @Expose
    @Valid
    private List<Task> subTasks = new ArrayList<>();

    public Task() {
    }

    public Task(Long id, @NotNull User owner, List<User> assignees, String dueDate, String dueTime,
            @NotBlank String timezone, @NotNull String name, Integer duration, @NotNull Project project,
            List<Label> labels, ReminderSetting reminderSetting, String recurrenceRule, Long createdAt, Long updatedAt,
            TaskStatus status) {
        super(id, name, owner, project, labels);
        this.assignees = assignees;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.timezone = timezone;
        this.duration = duration;
        this.status = status;
        if (reminderSetting.hasBefore() || reminderSetting.hasDate()) {
            this.reminderSetting = reminderSetting;
        }
        this.recurrenceRule = recurrenceRule;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
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

    public List<User> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<User> assignees) {
        this.assignees = assignees;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Task))
            return false;
        if (!super.equals(o))
            return false;
        Task task = (Task) o;
        return Objects.equals(getAssignees(), task.getAssignees()) && Objects.equals(getDueDate(), task.getDueDate())
                && Objects.equals(getDueTime(), task.getDueTime()) && Objects.equals(getTimezone(), task.getTimezone())
                && Objects.equals(getDuration(), task.getDuration())
                && Objects.equals(getReminderSetting(), task.getReminderSetting())
                && Objects.equals(getRecurrenceRule(), task.getRecurrenceRule())
                && Objects.equals(getSubTasks(), task.getSubTasks())
                && Objects.equals(getStatus(), task.getStatus());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getAssignees(), getDueDate(), getDueTime(), getTimezone(), getDuration(),
                getReminderSetting(), getRecurrenceRule(), getSubTasks(), getStatus());
    }

    public void clone(Task task) {
        super.clone(task);
        this.setDueDate(task.getDueDate());
        this.setDueTime(task.getDueTime());
        this.setTimezone(task.getTimezone());
        this.setDuration(task.getDuration());
        this.setStatus(task.getStatus());
        if (task.hasReminderSetting()
                && (task.getReminderSetting().hasBefore() || task.getReminderSetting().hasDate())) {
            this.setReminderSetting(task.getReminderSetting());
        }
        this.setRecurrenceRule(task.getRecurrenceRule());
        this.setAssignees(task.getAssignees());
    }

}
