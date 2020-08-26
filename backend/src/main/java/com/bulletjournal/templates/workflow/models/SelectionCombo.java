package com.bulletjournal.templates.workflow.models;

import com.bulletjournal.templates.repository.model.Selection;

import java.util.HashSet;
import java.util.Set;

/**
 * SelectionCombo is multiple Selections combined that can cross choices
 */
public class SelectionCombo {
    private Set<Selection> selections;

    public SelectionCombo() {
        this.selections = new HashSet<>();
    }

    public Set<Selection> getSelections() {
        return selections;
    }

    public void setSelections(Set<Selection> selections) {
        this.selections = selections;
    }

    public void add(Selection selection) {
        this.selections.add(selection);
    }

    public void remove(Selection selection) {
        this.selections.remove(selection);
    }

}
