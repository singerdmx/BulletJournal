package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

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

    @Type(type = "long-array")
    @Column(
            name = "labels",
            columnDefinition = "bigint[]"
    )
    private Long[] labels;

    public List<Long> getLabels() {
        if (this.labels == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(this.labels);
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels == null ? null : labels.stream().toArray(Long[]::new);
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

}
