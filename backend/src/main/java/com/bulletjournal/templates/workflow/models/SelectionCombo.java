package com.bulletjournal.templates.workflow.models;

import com.bulletjournal.templates.workflow.engine.RuleEngine;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * SelectionCombo is multiple Selections combined that can cross choices
 */
public class SelectionCombo implements Selectable {
    private Set<Selection> selections;

    public SelectionCombo(Set<Selection> selections) {
        this.selections = selections;
    }

    public Set<Selection> getSelections() {
        return selections;
    }

    public void setSelections(Set<Selection> selections) {
        this.selections = selections;
    }

    @Override
    public List<Step> getNextSteps() {
        // Set<Selection> => List<Step>
        return RuleEngine.applyRule(new ArrayList<>(this.selections));
    }

}
