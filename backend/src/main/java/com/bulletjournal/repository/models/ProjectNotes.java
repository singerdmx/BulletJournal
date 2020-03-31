package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_project_notes")
public class ProjectNotes extends AuditModel {

    @Id
    private Long projectId;

    /**
     * Store subNotes' hierarchy
     */
    @Column(length = 10485760)
    private String notes;

    public ProjectNotes() {
    }

    public ProjectNotes(final Long projectId) {
        this.projectId = projectId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}