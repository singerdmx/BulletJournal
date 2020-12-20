package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.ProjectItem;
import com.bulletjournal.repository.utils.LongArrayType;
import com.bulletjournal.repository.utils.StringArrayType;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

/**
 * Parent class for items under a project.
 * Its child classes are as follows:
 * {@link Task}: for ProjectType.TODO
 * {@link Note}: for ProjectType.NOTE
 * {@link Transaction}: for ProjectType.LEDGER
 */
@TypeDefs({
        @TypeDef(
                name = "long-array",
                typeClass = LongArrayType.class
        ),
        @TypeDef(
                name = "string-array",
                typeClass = StringArrayType.class
        ),
})
@MappedSuperclass
public abstract class ProjectItemModel<T extends ProjectItem> extends AuditModel {

    @NotBlank
    @Size(min = 1, max = 500)
    @Column(length = 500, nullable = false)
    private String name;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String owner;

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

    @Transient
    private Long[] sharedItemLabels;

    @Transient
    private boolean shared = false;

    public abstract Long getId();

    public abstract void setId(Long id);

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public List<Long> getLabels() {
        if (this.labels == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(this.labels);
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels == null ? null : labels.toArray(new Long[0]);
    }

    public List<Long> getSharedItemLabels() {
        if (this.sharedItemLabels == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(this.sharedItemLabels);
    }

    public void setSharedItemLabels(List<Long> sharedItemLabels) {
        this.sharedItemLabels = sharedItemLabels == null ? null : sharedItemLabels.toArray(new Long[0]);
    }

    public boolean isShared() {
        return shared;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public abstract T toPresentationModel();

    public abstract T toPresentationModel(
            List<com.bulletjournal.controller.models.Label> labels);

    public abstract ContentType getContentType();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectItemModel)) return false;
        ProjectItemModel that = (ProjectItemModel) o;
        return Objects.equals(getContentType(), that.getContentType()) &&
                Objects.equals(getId(), that.getId()) &&
                Objects.equals(getName(), that.getName()) &&
                Objects.equals(getOwner(), that.getOwner());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getContentType(), getId(), getName(), getOwner());
    }
}
