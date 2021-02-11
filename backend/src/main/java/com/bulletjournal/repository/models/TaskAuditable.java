package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "task_auditables")
public class TaskAuditable {

    @EmbeddedId
    private TaskAuditableKey id;

    @ManyToOne
    @MapsId("task_id")
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @MapsId("auditable_id")
    @JoinColumn(name = "auditable_id")
    private Auditable auditable;

    public TaskAuditable() {
    }

    public TaskAuditableKey getId() {
        return id;
    }

    public void setId(TaskAuditableKey id) {
        this.id = id;
    }

    public com.bulletjournal.repository.models.Task getTask() {
        return task;
    }

    public void setTask(com.bulletjournal.repository.models.Task task) {
        this.task = task;
    }

    public Auditable getAuditable() {
        return auditable;
    }

    public void setAuditable(Auditable auditable) {
        this.auditable = auditable;
    }
}
