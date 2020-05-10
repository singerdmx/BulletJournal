package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentType;

import javax.persistence.*;

/**
 * This class is for ProjectType.TODO
 */
@Entity
@Table(name = "tasks",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"google_calendar_event_id"})
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

}
