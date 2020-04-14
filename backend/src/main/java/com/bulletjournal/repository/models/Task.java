package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentType;

import javax.persistence.*;

/**
 * This class is for ProjectType.TODO
 */
@Entity
@Table(name = "tasks",
        indexes = {@Index(name = "task_project_id_index", columnList = "project_id"),
                @Index(name = "task_assignee_interval_index", columnList = "assigned_to, start_time, end_time"),
                @Index(name = "task_assignee_reminder_date_time_index", columnList = "assigned_to, start_time, reminder_date_time"),
                @Index(name = "task_assignee_recurrence_index", columnList = "assigned_to, recurrence_rule")
        })
public class Task extends TaskModel {
    @Id
    @GeneratedValue(generator = "task_generator")
    @SequenceGenerator(
            name = "task_generator",
            sequenceName = "task_sequence",
            initialValue = 100
    )
    private Long id;

    @Column(name = "completed_slots", columnDefinition = "TEXT")
    private String completedSlots;

    @Column(name = "google_calendar_event_id")
    private String googleCalendarEventId;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    public String getCompletedSlots() {
        return completedSlots;
    }

    public void setCompletedSlots(String completedSlots) {
        this.completedSlots = completedSlots;
    }

    public String getGoogleCalendarEventId() {
        return googleCalendarEventId;
    }

    public void setGoogleCalendarEventId(String googleCalendarEventId) {
        this.googleCalendarEventId = googleCalendarEventId;
    }
}
