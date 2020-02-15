package com.bulletjournal.controller.models;

import java.util.ArrayList;
import java.util.List;

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
}
