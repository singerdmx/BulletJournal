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

public class Task {
    @Expose
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String assignedTo;

    @NotBlank
    @Size(min = 10, max = 10)
    private String dueDate;

    private String dueTime;

    @NotBlank
    private String timezone;

    @NotNull
    private String name;

    // In minutes
    private Integer duration;

    @NotNull
    private Long projectId;

    private ReminderSetting reminderSetting;

    private Long[] labels;

    public Long[] getLabels() {
        return labels;
    }

    public void setLabels(Long[] labels) {
        this.labels = labels;
    }

    @Expose
    @Valid
    private List<Task> subTasks = new ArrayList<>();

    public Task() {
    }

    public Task(Long id,
                @NotBlank @Size(min = 1, max = 100) String assignedTo,
                @NotBlank @Size(min = 10, max = 10) String dueDate,
                String dueTime,
                @NotBlank String timezone,
                @NotNull String name,
                Integer duration,
                @NotNull Project project,
                ReminderSetting reminderSetting) {
        this.id = id;
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.timezone = timezone;
        this.name = name;
        this.duration = duration;
        this.projectId = project.getId();
        if (reminderSetting.hasBefore() || reminderSetting.hasDate()) {
            this.reminderSetting = reminderSetting;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public ReminderSetting getReminderSetting() {
        return reminderSetting;
    }

    public boolean hasReminderSetting() {
        return reminderSetting != null;
    }

    public void setReminderSetting(ReminderSetting reminderSetting) {
        this.reminderSetting = reminderSetting;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equals(id, task.id) &&
                Objects.equals(assignedTo, task.assignedTo) &&
                Objects.equals(dueDate, task.dueDate) &&
                Objects.equals(dueTime, task.dueTime) &&
                Objects.equals(timezone, task.timezone) &&
                Objects.equals(name, task.name) &&
                Objects.equals(projectId, task.projectId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, assignedTo, dueDate, dueTime, timezone, name, projectId, subTasks);
    }

    public void clone(Task task) {
        this.setId(task.getId());
        this.setAssignedTo(task.getAssignedTo());
        this.setDueDate(task.getDueDate());
        this.setDueTime(task.getDueTime());
        this.setTimezone(task.getTimezone());
        this.setName(task.getName());
        this.setDuration(task.getDuration());
        this.setProjectId(task.getProjectId());
        if (task.hasReminderSetting() &&
                (task.getReminderSetting().hasBefore() || task.getReminderSetting().hasDate())) {
            this.setReminderSetting(task.getReminderSetting());
        }
    }
}
