package com.bulletjournal.templates.controller.model;

import com.bulletjournal.controller.models.Project;

import java.util.List;

public class SubscribedCategory {
    private Category category;

    private List<Selection> selections;

    private Project project;

    public SubscribedCategory() {
    }

    public SubscribedCategory(Category category, List<Selection> selections, Project project) {
        this.category = category;
        this.selections = selections;
        this.project = project;
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
