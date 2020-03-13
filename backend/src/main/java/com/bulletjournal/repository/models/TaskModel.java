package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.utils.LongArrayType;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

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

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "due_date", length = 15, nullable = false)
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

    @Column(name = "start_time", nullable = false)
    private Timestamp startTime;

    @Column(name = "end_time", nullable = false)
    private Timestamp endTime;

    @Column(name = "reminder_date_time")
    private Timestamp reminderDateTime;

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

    public void setReminderSetting(ReminderSetting reminderSetting) {
        if (reminderSetting == null) {
            return;
        }

        if (reminderSetting.hasBefore()) {
            this.setReminderBeforeTask(reminderSetting.getBefore());
            this.setReminderDateTime(getReminderDateTime(this.getStartTime(), reminderSetting.getBefore()));
            return;
        }

        if (reminderSetting.hasDate()) {
            this.setReminderDate(reminderSetting.getDate());
        }

        if (reminderSetting.hasTime()) {
            this.setReminderTime(reminderSetting.getTime());
        }

        if (reminderSetting.hasDate() || reminderSetting.hasTime()) {
            ZonedDateTime reminderZonedDateTime =
                    ZonedDateTimeHelper.getStartTime(this.getReminderDate(), this.getReminderTime(), this.getTimezone());
            this.setReminderDateTime(Timestamp.from(reminderZonedDateTime.toInstant()));
        }
    }

    private Timestamp getReminderDateTime(Timestamp startTime, Integer before) {
        Instant reminderInstant = null;
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
        if (this.hasReminderBeforeTask()) {
            reminderSetting.setBefore(this.getReminderBeforeTask());
        } else {
            if (this.hasReminderDate()) {
                reminderSetting.setDate(this.getReminderDate());
            }
            if (this.hasReminderTime()) {
                reminderSetting.setTime(this.getReminderTime());
            }
        }

        return new com.bulletjournal.controller.models.Task(
                this.getId(),
                this.getAssignedTo(),
                this.getDueDate(),
                this.getDueTime(),
                this.getTimezone(),
                this.getName(),
                this.getDuration(),
                this.getProject(),
                labels,
                reminderSetting);
    }

    public abstract Long getId();
}
