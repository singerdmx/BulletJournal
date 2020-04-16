package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Before;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.utils.LongArrayType;
import com.google.common.base.Preconditions;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

@TypeDefs({
        @TypeDef(
                name = "long-array",
                typeClass = LongArrayType.class
        )
})
@MappedSuperclass
public abstract class TaskModel extends ProjectItemModel {
    private static final Logger LOGGER = LoggerFactory.getLogger(TaskModel.class);
    @NotBlank
    @Size(min = 2, max = 1_000_000)
    @Column(name = "assigned_to", length = 1_000_000)
    private String assignedTo;

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
        return reminderDateTime;
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

        ZonedDateTime reminderZonedDateTime =
                ZonedDateTimeHelper.getStartTime(this.getReminderDate(), this.getReminderTime(), this.getTimezone());
        this.setReminderDateTime(Timestamp.from(reminderZonedDateTime.toInstant()));
    }

    public String getRecurrenceRule() {
        return recurrenceRule;
    }

    public void setRecurrenceRule(String recurrenceRule) {
        this.recurrenceRule = recurrenceRule;
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

    public com.bulletjournal.controller.models.Task toPresentationModel() {
        return toPresentationModel(Collections.emptyList());
    }

    public com.bulletjournal.controller.models.Task toPresentationModel(
            List<com.bulletjournal.controller.models.Label> labels) {

        ReminderSetting reminderSetting = new ReminderSetting();
        if (this.hasReminderDate()) {
            reminderSetting.setDate(this.getReminderDate());
            if (this.hasReminderTime()) {
                reminderSetting.setTime(this.getReminderTime());
            }
        } else if (this.hasReminderBeforeTask()) {
            reminderSetting.setBefore(this.getReminderBeforeTask());
        }

        return new com.bulletjournal.controller.models.Task(
                this.getId(),
                this.getOwner(),
                this.getAssignedTo(),
                this.getDueDate(),
                this.getDueTime(),
                this.getTimezone(),
                this.getName(),
                this.getDuration(),
                this.getProject(),
                labels,
                reminderSetting,
                this.getRecurrenceRule());
    }

}
