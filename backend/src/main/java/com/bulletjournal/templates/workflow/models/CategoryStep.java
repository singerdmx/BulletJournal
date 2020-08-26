package com.bulletjournal.templates.workflow.models;

import com.bulletjournal.templates.repository.model.Category;
import com.bulletjournal.templates.repository.model.Choice;

import java.util.List;

public class CategoryStep extends FlowStep {

    private final Category category;

    public CategoryStep(Category category, List<Choice> choices, String name) {
        super(choices, name);
        this.category = category;
    }

    public Category getCategory() {
        return this.category;
    }
}
