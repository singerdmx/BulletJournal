package com.bulletjournal.templates.controller.model;

import com.bulletjournal.controller.models.Project;

import java.util.ArrayList;
import java.util.List;

public class SubscribedCategory {
    private Category category;

    private List<Selection> selections = new ArrayList<>();

    private List<Project> projects = new ArrayList<>();

    public SubscribedCategory() {
    }

    public SubscribedCategory(Category category, List<Selection> selections, List<Project> projects) {
        this.category = category;
        this.selections = selections;
        this.projects = projects;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Selection> getSelections() {
        return selections;
    }

    public void setSelections(List<Selection> selections) {
        this.selections = selections;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public void addSelection(Selection selection) {
        if (selections == null) {
            selections = new ArrayList<>();
        }
        selections.add(selection);
    }

    public void addProject(Project project) {
        if (projects == null) {
            projects = new ArrayList<>();
        }
        projects.add(project);
    }
}
