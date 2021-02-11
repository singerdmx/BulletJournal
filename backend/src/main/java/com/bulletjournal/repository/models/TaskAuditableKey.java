package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TaskAuditableKey implements Serializable {

    @NotNull
    @Column(name = "task_id")
    private Long taskId;

    @NotNull
    @Column(name = "auditable_id")
    private Long auditableId;

    public TaskAuditableKey() {
    }

    public TaskAuditableKey(@NotNull Long taskId, @NotNull Long auditableId) {
        this.taskId = taskId;
        this.auditableId = auditableId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getAuditableId() {
        return auditableId;
    }

    public void setAuditableId(Long auditableId) {
        this.auditableId = auditableId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TaskAuditableKey)) return false;
        TaskAuditableKey that = (TaskAuditableKey) o;
        return Objects.equals(getTaskId(), that.getTaskId()) && Objects.equals(getAuditableId(), that.getAuditableId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTaskId(), getAuditableId());
    }
}
