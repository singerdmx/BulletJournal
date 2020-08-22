package com.bulletjournal.templates.workflow.models;

import java.util.List;

public class Choice {
    private List<Selection> selections;
    private String name;

    // multiple selections or single selection
    private boolean multiple;

    public Choice() {
    }

    public Choice(List<Selection> selections, boolean multiple, String name) {
        this.selections = selections;
        this.multiple = multiple;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Selection> getSelections() {
        return selections;
    }

    public void addSelections(List<Selection> selections) {
        this.selections.addAll(selections);
    }

    public void setSelections(List<Selection> selections) {
        this.selections = selections;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }
}
