package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

/**
 * Parent class for items under a project.
 * Its child classes are as follows:
 * {@link Task}: for ProjectType.TODO
 * {@link Note}: for ProjectType.NOTE
 * {@link Transaction}: for ProjectType.LEDGER
 */
@MappedSuperclass
public abstract class ProjectItemModel extends OwnedModel {

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

}
