package com.bulletjournal.templates.controller.model;

import java.util.ArrayList;
import java.util.List;

public class Step {

    private Long id;

    private String name;

    private List<Choice> choices = new ArrayList<>();

    private List<Selection> excludedSelections = new ArrayList<>();

    private Step nextStep;

    public Step() {
    }

    public Step(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Step(Long id, String name, List<Choice> choices) {
        this.id = id;
        this.name = name;
        this.choices = choices;
    }

    public Step(Long id, String name, List<Choice> choices, Step nextStep) {
        this.id = id;
        this.name = name;
        this.choices = choices;
        this.nextStep = nextStep;
    }

    public Step getNextStep() {
        return nextStep;
    }

    public void setNextStep(Step nextStep) {
        this.nextStep = nextStep;
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

    public List<Selection> getExcludedSelections() {
        return excludedSelections;
    }

    public void setExcludedSelections(List<Selection> excludedSelections) {
        this.excludedSelections = excludedSelections;
    }
}
