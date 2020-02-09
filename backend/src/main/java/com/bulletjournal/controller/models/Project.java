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

    @NotNull
    private ProjectType projectType;

    @NotNull
    @Valid
    private Group group;

    @Expose
    @Valid
    private List<Project> subProjects = new ArrayList<>();

    public Project() {
    }

    public Project(Long id, String name, String owner, ProjectType projectType, Group group) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.projectType = projectType;
        this.group = group;
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

    public void addSubProject(Project subProject) {
        this.subProjects.add(subProject);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return Objects.equals(id, project.id) &&
                Objects.equals(name, project.name) &&
                Objects.equals(owner, project.owner) &&
                projectType == project.projectType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, owner, projectType);
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
