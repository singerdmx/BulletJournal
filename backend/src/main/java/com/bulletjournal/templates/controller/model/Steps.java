package com.bulletjournal.templates.controller.model;

import java.util.ArrayList;
import java.util.List;

public class Steps {
    private List<Step> steps = new ArrayList<>();
    private List<Category> categories = new ArrayList<>();

    public Steps() {
    }

    public Steps(List<Step> steps, List<Category> categories) {
        this.steps = steps;
        this.categories = categories;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}
