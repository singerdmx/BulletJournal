package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Parent class for items under a project.
 * Its child classes are as follows:
 * {@link Task}: for ProjectType.TODO
 * {@link Note}: for ProjectType.NOTE
 * {@link Ledger}: for ProjectType.LEDGER
 */
@MappedSuperclass
public abstract class ProjectItemModel extends OwnedModel {

    @NotBlank
    @Size(min = 1, max = 100)
    @Column(name = "created_by", nullable = false, updatable = false)
    private String createdBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
