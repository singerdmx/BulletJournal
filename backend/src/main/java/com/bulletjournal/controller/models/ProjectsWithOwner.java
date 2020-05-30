package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ProjectsWithOwner {

    private User owner;

    private List<Project> projects = new ArrayList<>();

    public ProjectsWithOwner() {
    }

    public ProjectsWithOwner(User owner, List<Project> projects) {
        this.owner = owner;
        this.projects = projects;
    }

    public static List<ProjectsWithOwner> addOwnerAvatar(List<ProjectsWithOwner> projects, UserClient userClient) {
        projects.forEach(p -> addOwnerAvatar(p, userClient));
        return projects;
    }

    public static ProjectsWithOwner addOwnerAvatar(ProjectsWithOwner projects, UserClient userClient) {
        projects.setOwner(userClient.getUser(projects.getOwner().getName()));
        projects.projects.forEach(p -> Project.addOwnerAvatar(p, userClient));
        return projects;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
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
