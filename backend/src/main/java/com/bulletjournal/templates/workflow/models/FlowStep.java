package com.bulletjournal.templates.workflow.models;

import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.Selection;

import java.util.List;

public class FlowStep implements Step {

    private String name;

    private final SelectionCombo selections;

    private final List<Choice> choices;

    public FlowStep(List<Choice> choices, String name) {
        this.selections = new SelectionCombo();
        this.choices = choices;
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void select(Selection selection) {
        this.selections.add(selection);
    }

    @Override
    public void unselect(Selection selection) {
        this.selections.remove(selection);
    }

    @Override
    public List<Choice> getChoices() {
        return this.choices;
    }

    @Override
    public void addChoice(Choice choice) {
        this.choices.add(choice);
    }

    @Override
    public void removeChoice(Choice choice) {
        this.choices.remove(choice);
    }
}
