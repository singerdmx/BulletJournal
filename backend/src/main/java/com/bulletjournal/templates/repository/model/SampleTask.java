package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "sample_tasks", schema = "template")
public class SampleTask extends NamedModel {
    @Id
    @GeneratedValue(generator = "sample_task_generator")
    @SequenceGenerator(name = "sample_task_generator",
            sequenceName = "template.sample_task_sequence",
            initialValue = 100,
            allocationSize = 2)
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "metadata")
    private String metadata;

    @Column(name = "uid")
    private String uid;

    @Column(name = "due_date", length = 15)
    private String dueDate; // "yyyy-MM-dd"

    @Column(name = "due_time", length = 10)
    private String dueTime; // "HH-mm"

    @Column(name = "available_before")
    private Timestamp availableBefore;

    @Column(name = "time_zone")
    private String timeZone;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getContent() {
        return content;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
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

    public Timestamp getAvailableBefore() {
        return availableBefore;
    }

    public void setAvailableBefore(Timestamp availableBefore) {
        this.availableBefore = availableBefore;
    }

    public com.bulletjournal.templates.controller.model.SampleTask toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.SampleTask(
                id,
                getName(),
                content,
                metadata,
                uid,
                dueDate,
                dueTime,
                availableBefore,
                timeZone
            );
    }
}
