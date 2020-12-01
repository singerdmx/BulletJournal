package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Before;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.util.BuJoRecurrenceRule;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@MappedSuperclass
public abstract class TaskModel extends ProjectItemModel<com.bulletjournal.controller.models.Task> {
    private static final Logger LOGGER = LoggerFactory.getLogger(TaskModel.class);

    @Column(name = "due_date", length = 15)
    private String dueDate; // "yyyy-MM-dd"

    @Column(name = "due_time", length = 10)
    private String dueTime; // "HH-mm"

    @Column(name = "timezone", nullable = false)
    private String timezone;

    // In minutes
    @Column
    private Integer duration;

    @Column(name = "reminder_date", length = 15)
    private String reminderDate; // "yyyy-MM-dd"

    @Column(name = "reminder_time", length = 10)
    private String reminderTime; // "HH-mm"

    // reminder before task
    @Column(name = "reminder_before_task")
    private Integer reminderBeforeTask;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "end_time")
    private Timestamp endTime;

    @Column(name = "reminder_date_time")
    private Timestamp reminderDateTime;

    @Column(name = "recurrence_rule")
    private String recurrenceRule;

    @Column(name = "google_calendar_event_id")
    private String googleCalendarEventId;

    @Type(type = "string-array")
    @Column(name = "assignees", columnDefinition = "text[]")
    private String[] assignees;

    @Column(name = "location", nullable = true)
    private String location;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    public boolean hasDueDate() {
        return this.dueDate != null;
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

    public String getReminderDate() {
        return reminderDate;
    }

    public void setReminderDate(String reminderDate) {
        this.reminderDate = reminderDate;
    }

    public boolean hasReminderDate() {
        return this.reminderDate != null;
    }

    public String getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(String reminderTime) {
        this.reminderTime = reminderTime;
    }

    public boolean hasReminderTime() {
        return this.reminderTime != null;
    }

    public Integer getReminderBeforeTask() {
        return reminderBeforeTask;
    }

    public void setReminderBeforeTask(Integer reminderBeforeTask) {
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public boolean hasReminderBeforeTask() {
        return this.reminderBeforeTask != null;
    }

    public Timestamp getReminderDateTime() {
        return this.reminderDateTime;
    }

    public boolean hasReminderDateTime() {
        return this.reminderDateTime != null;
    }

    public boolean hasRecurrenceRule() {
        return StringUtils.isNotBlank(recurrenceRule);
    }

    public void setReminderDateTime(Timestamp reminderDateTime) {
        this.reminderDateTime = reminderDateTime;
    }

    public ReminderSetting getReminderSetting() {
        return new ReminderSetting(this.getReminderDate(), this.getReminderTime(), this.getReminderBeforeTask());
    }

    public void setReminderSetting(ReminderSetting reminderSetting) {
        Preconditions.checkNotNull(reminderSetting, "ReminderSetting cannot be null");
        Preconditions.checkNotNull(this.getTimezone(), "Timezone cannot be null");

        if (!reminderSetting.hasBefore() && !reminderSetting.hasDate()) {
            LOGGER.info("User did not specify Reminder Date, Set to no reminder");
            reminderSetting.setBefore(Before.NONE.getValue());
        }
        if (reminderSetting.hasBefore()) {
            this.setReminderBeforeTask(reminderSetting.getBefore());
            if (this.getStartTime() != null) {
                this.setReminderDateTime(getReminderDateTime(this.getStartTime(), reminderSetting.getBefore()));
            } else {
                this.setReminderDateTime(null);
            }
            this.setReminderDate(null);
            this.setReminderTime(null);
            return;
        }

        Preconditions.checkNotNull(reminderSetting.getDate(), "ReminderSetting must have Date");
        this.setReminderDate(reminderSetting.getDate());
        this.setReminderBeforeTask(null);

        if (reminderSetting.hasTime()) {
            this.setReminderTime(reminderSetting.getTime());
        }

        ZonedDateTime reminderZonedDateTime = ZonedDateTimeHelper.getStartTime(this.getReminderDate(),
                this.getReminderTime(), this.getTimezone());
        this.setReminderDateTime(Timestamp.from(reminderZonedDateTime.toInstant()));
    }

    public String getGoogleCalendarEventId() {
        return googleCalendarEventId;
    }

    public void setGoogleCalendarEventId(String googleCalendarEventId) {
        this.googleCalendarEventId = googleCalendarEventId;
    }

    public List<String> getAssignees() {
        if (this.assignees == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(this.assignees);
    }

    public void setAssignees(List<String> assignees) {
        this.assignees = assignees == null ? null : assignees.stream().toArray(String[]::new);
    }

    public String getRecurrenceRule() {
        return recurrenceRule;
    }

    public void setRecurrenceRule(String recurrenceRule) {
        try {
            if (Objects.nonNull(recurrenceRule)) {
                BuJoRecurrenceRule.create(recurrenceRule);
            }
            this.recurrenceRule = recurrenceRule;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Illegal recurrence rule: " + recurrenceRule);
        }
    }

    private Timestamp getReminderDateTime(Timestamp startTime, Integer before) {
        Instant reminderInstant;
        switch (before) {
            case 0:
                reminderInstant = startTime.toInstant();
                break;
            case 1:
                reminderInstant = startTime.toInstant().minus(5, ChronoUnit.MINUTES);
                break;
            case 2:
                reminderInstant = startTime.toInstant().minus(10, ChronoUnit.MINUTES);
                break;
            case 3:
                reminderInstant = startTime.toInstant().minus(30, ChronoUnit.MINUTES);
                break;
            case 4:
                reminderInstant = startTime.toInstant().minus(1, ChronoUnit.HOURS);
                break;
            case 5:
                reminderInstant = startTime.toInstant().minus(2, ChronoUnit.HOURS);
                break;
            case 6:
                return null;
            default:
                throw new IllegalArgumentException();
        }
        return Timestamp.from(reminderInstant);
    }

    @Override
    public com.bulletjournal.controller.models.Task toPresentationModel() {
        return toPresentationModel(
                (this.isShared() ? this.getSharedItemLabels() : this.getLabels())
                        .stream().map(Label::new).collect(Collectors.toList()));
    }

    @Override
    public com.bulletjournal.controller.models.Task toPresentationModel(List<Label> labels) {

        ReminderSetting reminderSetting = new ReminderSetting();
        if (this.hasReminderDate()) {
            reminderSetting.setDate(this.getReminderDate());
            if (this.hasReminderTime()) {
                reminderSetting.setTime(this.getReminderTime());
            }
        } else if (this.hasReminderBeforeTask()) {
            reminderSetting.setBefore(this.getReminderBeforeTask());
        }

        Long reminderDateTime = null;
        if (this.getReminderDateTime() != null) {
            reminderDateTime = this.getReminderDateTime().getTime();
        }

        com.bulletjournal.controller.models.Task task = new com.bulletjournal.controller.models.Task(
            this.getId(),
            new User(this.getOwner()),
            this.getAssignees().stream().map(a -> new User(a)).collect(Collectors.toList()),
            this.getDueDate(),
            this.getDueTime(),
            this.getTimezone(),
            this.getName(),
            this.getDuration(),
            this.getProject(),
            labels,
            reminderSetting,
            this.getRecurrenceRule(),
            this.getCreatedAt().getTime(),
            this.getUpdatedAt().getTime(),
            null,
            reminderDateTime,
            this.location
        );

        task.setShared(this.isShared());
        return task;
    }

    @Override
    public String toString() {
        return "TaskModel{" +
            "dueDate='" + dueDate + '\'' +
            ", dueTime='" + dueTime + '\'' +
            ", timezone='" + timezone + '\'' +
            ", duration=" + duration +
            ", reminderDate='" + reminderDate + '\'' +
            ", reminderTime='" + reminderTime + '\'' +
            ", reminderBeforeTask=" + reminderBeforeTask +
            ", startTime=" + startTime +
            ", endTime=" + endTime +
            ", reminderDateTime=" + reminderDateTime +
            ", recurrenceRule='" + recurrenceRule + '\'' +
            ", googleCalendarEventId='" + googleCalendarEventId + '\'' +
            ", assignees=" + Arrays.toString(assignees) +
            ", location='" + location + '\'' +
            '}';
    }
}
