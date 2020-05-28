package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.ProjectItem;
import com.bulletjournal.repository.utils.LongArrayType;
import com.bulletjournal.repository.utils.StringArrayType;
import org.hibernate.annotations.*;

import javax.persistence.*;
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
public abstract class ProjectItemModel<T extends ProjectItem> extends OwnedModel {

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
        this.labels = labels == null ? null : labels.toArray(new Long[0]);
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public abstract T toPresentationModel(Map<String, String> aliases);

    public abstract T toPresentationModel(
            List<com.bulletjournal.controller.models.Label> labels, Map<String, String> aliases);

    public abstract ContentType getContentType();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectItemModel)) return false;
        ProjectItemModel that = (ProjectItemModel) o;
        return Objects.equals(getProject(), that.getProject()) &&
                Objects.equals(getId(), that.getId()) &&
                Objects.equals(getName(), that.getName()) &&
                Objects.equals(getOwner(), that.getOwner());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getProject(), getId(), getName(), getOwner());
    }
}
