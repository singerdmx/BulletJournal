package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_project_tasks")
public class ProjectTasks extends AuditModel {

    @Id
    private Long projectId;

    /**
     * Store Tasks' hierarchy
     */
    @Column(length = 10485760)
    private String tasks;

    public ProjectTasks() {
    }

    public ProjectTasks(final Long projectId) {
        this.projectId = projectId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getTasks() {
        return tasks;
    }

    public void setTasks(String tasks) {
        this.tasks = tasks;
    }
}