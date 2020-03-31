package com.bulletjournal.controller.models;

import com.google.gson.annotations.Expose;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Project {
    @Expose
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotBlank
    @Size(min = 1, max = 100)
    private String owner;

    private String ownerAvatar;

    private boolean shared;

    @NotNull
    private ProjectType projectType;

    @NotNull
    @Valid
    private Group group;

    private String description;

    @Expose
    @Valid
    private List<Project> subProjects = new ArrayList<>();

    public Project() {
    }

    public Project(Long id) {
        this.id = id;
    }

    public Project(Long id, String name, String owner, ProjectType projectType,
                   Group group, String description, boolean shared) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.projectType = projectType;
        this.group = group;
        this.description = description;
        this.shared = shared;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public ProjectType getProjectType() {
        return projectType;
    }

    public void setProjectType(ProjectType projectType) {
        this.projectType = projectType;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public List<Project> getSubProjects() {
        return subProjects;
    }

    public void setSubProjects(List<Project> subProjects) {
        this.subProjects = subProjects;
    }

    public void addSubProject(Project subProject) {
        this.subProjects.add(subProject);
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerAvatar() {
        return ownerAvatar;
    }

    public void setOwnerAvatar(String ownerAvatar) {
        this.ownerAvatar = ownerAvatar;
    }

    public boolean isShared() {
        return shared;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
    }

    public void clone(Project other) {
        this.setGroup(other.getGroup());
        this.setName(other.getName());
        this.setId(other.getId());
        this.setOwner(other.getOwner());
        this.setProjectType(other.getProjectType());
        this.setDescription(other.getDescription());
        this.setShared(other.isShared());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;
        Project project = (Project) o;
        return isShared() == project.isShared() &&
                Objects.equals(getId(), project.getId()) &&
                Objects.equals(getName(), project.getName()) &&
                Objects.equals(getOwner(), project.getOwner()) &&
                getProjectType() == project.getProjectType();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getOwner(), isShared(), getProjectType());
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", owner='" + owner + '\'' +
                ", projectType=" + projectType +
                '}';
    }
}
