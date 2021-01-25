package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.User;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Objects;

@Entity
@Table(name = "projects",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"owner", "name"})
        })
public class Project extends NamedModel {

    @Id
    @GeneratedValue(generator = "project_generator")
    @SequenceGenerator(
            name = "project_generator",
            sequenceName = "project_sequence",
            initialValue = 100
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false)
    private String owner;

    @NotNull
    @Column(updatable = false, nullable = false)
    private Integer type;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Group group;

    @Column(length = 90000)
    private String description;

    @Column(nullable = false, columnDefinition = "Boolean default 'false'")
    private boolean shared;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "project")
    @PrimaryKeyJoinColumn
    private ProjectSetting projectSetting;

    public Project() {
    }

    public Project(String name, Integer type, Group group, boolean shared) {
        this.type = type;
        this.group = group;
        this.shared = shared;
        this.setName(name);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
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

    public boolean isShared() {
        return shared;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
    }

    public com.bulletjournal.controller.models.Project toPresentationModel() {
        return new com.bulletjournal.controller.models.Project(
                this.getId(), this.getName(), new User(this.getOwner()),
                ProjectType.getType(this.getType()),
                this.getGroup().toPresentationModel(),
                this.getDescription(),
                this.isShared());
    }

    public com.bulletjournal.controller.models.Project toVerbosePresentationModel() {
        return new com.bulletjournal.controller.models.Project(
                this.getId(), this.getName(), new User(this.getOwner()),
                ProjectType.getType(this.getType()),
                this.getGroup().toVerbosePresentationModel(),
                this.getDescription(),
                this.isShared());
    }

    public ProjectSetting getProjectSetting() {
        return projectSetting;
    }

    public void setProjectSetting(ProjectSetting projectSetting) {
        this.projectSetting = projectSetting;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;
        Project project = (Project) o;
        return isShared() == project.isShared() &&
                Objects.equals(getId(), project.getId()) &&
                Objects.equals(getType(), project.getType()) &&
                Objects.equals(getGroup(), project.getGroup()) &&
                Objects.equals(getDescription(), project.getDescription());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getType(), getGroup(), getDescription(), isShared());
    }
}