package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentType;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "completed_tasks")
public class CompletedTask extends TaskModel {

    @Id
    @GeneratedValue(generator = "completed_task_generator")
    @SequenceGenerator(
            name = "completed_task_generator",
            sequenceName = "completed_task_sequence",
            initialValue = 100
    )
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String contents;

    public CompletedTask() {
    }

    public CompletedTask(Task task, String contents) {
        this.setName(task.getName());
        this.setOwner(task.getOwner());
        this.setProject(task.getProject());
        this.setDueDate(task.getDueDate());
        this.setDueTime(task.getDueTime());
        this.setDuration(task.getDuration());
        this.setStartTime(task.getStartTime());
        this.setEndTime(task.getEndTime());
        this.setTimezone(task.getTimezone());
        this.setReminderBeforeTask(task.getReminderBeforeTask());
        this.setReminderDate(task.getReminderDate());
        this.setReminderTime(task.getReminderTime());
        this.setReminderDateTime(task.getReminderDateTime());
        this.setCreatedAt(task.getCreatedAt());
        this.setUpdatedAt(task.getUpdatedAt());
        this.setRecurrenceRule(task.getRecurrenceRule());
        this.setContents(contents);
        this.setGoogleCalendarEventId(task.getGoogleCalendarEventId());
        this.setAssignees(task.getAssignees());
        this.setLocation(task.getLocation());
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CompletedTask)) return false;
        CompletedTask that = (CompletedTask) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
