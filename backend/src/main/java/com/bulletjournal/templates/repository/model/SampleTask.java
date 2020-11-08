package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

@Entity
@Table(name = "sample_tasks", schema = "template")
public class SampleTask extends AuditModel {
    @Id
    @GeneratedValue(generator = "sample_task_generator")
    @SequenceGenerator(name = "sample_task_generator",
            sequenceName = "template.sample_task_sequence",
            initialValue = 100,
            allocationSize = 2)
    private Long id;

    @NotBlank
    @Size(min = 1, max = 500)
    @Column(length = 500, nullable = false)
    private String name;

    @Column(name = "content")
    private String content;

    @Column(name = "refreshable")
    private boolean refreshable;

    @Column(name = "pending")
    private boolean pending;

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

    @Column
    private String raw;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public boolean hasContent() {
        return StringUtils.isNotBlank(this.content);
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

    public boolean hasDueDate() {
        return this.dueDate != null;
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

    public boolean isPending() {
        return pending;
    }

    public void setPending(boolean pending) {
        this.pending = pending;
    }

    public boolean isRefreshable() {
        return refreshable;
    }

    public void setRefreshable(boolean refreshable) {
        this.refreshable = refreshable;
    }

    public String getRaw() {
        return raw;
    }

    public void setRaw(String raw) {
        this.raw = raw;
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
                timeZone,
                pending,
                refreshable,
                raw);
    }

    public com.bulletjournal.templates.controller.model.SampleTask toSimplePresentationModel() {
        return new com.bulletjournal.templates.controller.model.SampleTask(
                id,
                getName(),
                null,
                null,
                null,
                dueDate,
                dueTime,
                timeZone,
                pending,
                refreshable,
                raw);
    }
}
