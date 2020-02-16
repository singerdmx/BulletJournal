package com.bulletjournal.controller.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ProjectsWithOwner {

    private String owner;

    private List<Project> projects = new ArrayList<>();

    public ProjectsWithOwner() {
    }

    public ProjectsWithOwner(String owner, List<Project> projects) {
        this.owner = owner;
        this.projects = projects;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectsWithOwner that = (ProjectsWithOwner) o;
        return Objects.equals(owner, that.owner) &&
                Objects.equals(projects, that.projects);
    }

    @Override
    public int hashCode() {
        return Objects.hash(owner, projects);
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("ProjectsWithOwner{");
        projects.forEach(project -> builder.append(project.toString()));
        builder.append("}");
        return builder.toString();
    }
}
