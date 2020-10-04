package com.bulletjournal.templates.controller.model;

import java.util.ArrayList;
import java.util.List;

public class Step {

    private Long id;

    private String name;

    private List<Choice> choices = new ArrayList<>();

    private List<Long> excludedSelections = new ArrayList<>();

    private List<Rule> rules = new ArrayList<>();

    public Step() {
    }

    public Step(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Step(Long id, String name, List<Choice> choices, List<Rule> rules, List<Long> excludedSelections) {
        this.id = id;
        this.name = name;
        this.choices = choices;
        this.rules = rules;
        this.excludedSelections = excludedSelections;
    }

    public List<Rule> getRules() {
        return rules;
    }

    public void setRules(List<Rule> rules) {
        this.rules = rules;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    public List<Long> getExcludedSelections() {
        return excludedSelections;
    }

    public void setExcludedSelections(List<Long> excludedSelections) {
        this.excludedSelections = excludedSelections;
    }
}
