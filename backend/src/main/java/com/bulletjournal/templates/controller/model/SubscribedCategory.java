package com.bulletjournal.templates.controller.model;

import com.bulletjournal.controller.models.Project;

public class SubscribedCategory {
    private Category category;

    private Selection selection;

    private Project project;

    public SubscribedCategory() {
    }

    public SubscribedCategory(Category category, Selection selection, Project project) {
        this.category = category;
        this.selection = selection;
        this.project = project;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Selection getSelection() {
        return selection;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public String toString() {
        return "SubscribedCategory{" +
            ", category=" + category +
            ", selection=" + selection +
            ", project=" + project +
            '}';
    }
}
