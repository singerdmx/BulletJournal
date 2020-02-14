package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.ProjectType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "projects",
        indexes = {@Index(name = "project_owner_index", columnList = "owner")},
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"owner", "name"})
        })
public class Project extends OwnedModel {

    @Id
    @GeneratedValue(generator = "project_generator")
    @SequenceGenerator(
            name = "project_generator",
            sequenceName = "project_sequence"
    )
    private Long id;

    @NotNull
    @Column(updatable = false, nullable = false)
    private Integer type;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Group group;

    @Column
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        if (!group.getProjects().contains(group)) {
            this.group = group;
            group.addProject(this);
        }
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public com.bulletjournal.controller.models.Project toPresentationModel() {
        return new com.bulletjournal.controller.models.Project(
                this.getId(), this.getName(), this.getOwner(),
                ProjectType.getType(this.getType()),
                this.getGroup().toPresentationModel(),
                this.getDescription());
    }
}