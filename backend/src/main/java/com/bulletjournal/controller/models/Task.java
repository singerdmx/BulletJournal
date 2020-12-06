package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.Project;
import com.google.gson.annotations.Expose;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Task extends ProjectItem {

    protected static final int DEFAULT_DURATION_IN_DAYS = 1;

    private Long startTime;

    private Long endTime;

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

    private Long reminderDateTime;

    private String location;

    @Expose
    @Valid
    private List<Task> subTasks = new ArrayList<>();

    public Task() {
    }

    public Task(Long id, @NotNull User owner, List<User> assignees, String dueDate, String dueTime,
                @NotBlank String timezone, @NotNull String name, Integer duration, @NotNull Project project,
                List<Label> labels, ReminderSetting reminderSetting, String recurrenceRule, Long createdAt, Long updatedAt,
                TaskStatus status, Long reminderDateTime) {
        this(id, owner, assignees, dueDate, dueTime, timezone, name, duration, project, labels, reminderSetting, recurrenceRule, createdAt, updatedAt, status, reminderDateTime, null);
    }

    public Task(Long id, @NotNull User owner, List<User> assignees, String dueDate, String dueTime,
                @NotBlank String timezone, @NotNull String name, Integer duration, @NotNull Project project,
                List<Label> labels, ReminderSetting reminderSetting, String recurrenceRule, Long createdAt, Long updatedAt,
                TaskStatus status, Long reminderDateTime, String location) {
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
        this.reminderDateTime = reminderDateTime;
        this.recurrenceRule = recurrenceRule;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        getView(this);
        this.location = location;
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

    public Long getReminderDateTime() {
        return reminderDateTime;
    }

    public void setReminderDateTime(Long reminderDateTime) {
        this.reminderDateTime = reminderDateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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
                && Objects.equals(getStatus(), task.getStatus())
                && Objects.equals(getReminderDateTime(), task.getReminderDateTime());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getAssignees(), getDueDate(), getDueTime(), getTimezone(), getDuration(),
                getReminderSetting(), getRecurrenceRule(), getSubTasks(), getStatus(), getReminderDateTime());
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
        this.setReminderDateTime(task.getReminderDateTime());
        this.setLocation(task.location);
    }

    public static Task getView(Task task) {
        String date = task.getDueDate();
        if (Objects.isNull(date)) {
            return task;
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
        task.setStartTime(startTime);
        task.setEndTime(endTime);
        return task;
    }
}
