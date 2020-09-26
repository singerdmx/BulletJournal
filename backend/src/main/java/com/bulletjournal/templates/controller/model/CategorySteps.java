package com.bulletjournal.templates.controller.model;

import com.bulletjournal.templates.workflow.models.SelectionCombo;
import org.apache.commons.lang3.tuple.Triple;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CategorySteps {

    /*
        Step: from
        Rule: rule (can be null)
        Step: to
     */
    private List<Triple<Step, Rule, Step>> connections = new ArrayList<>();

    private Map<Step, Map<SelectionCombo, SampleTasks>> finalSteps = new HashMap<>();

    private List<Long> stepIds = new ArrayList<>();

    public List<Triple<Step, Rule, Step>> getConnections() {
        return connections;
    }

    public void setConnections(List<Triple<Step, Rule, Step>> connections) {
        this.connections = connections;
    }

    public Map<Step, Map<SelectionCombo, SampleTasks>> getFinalSteps() {
        return finalSteps;
    }

    public void setFinalSteps(Map<Step, Map<SelectionCombo, SampleTasks>> finalSteps) {
        this.finalSteps = finalSteps;
    }

    public List<Long> getStepIds() {
        return stepIds;
    }

    public void setStepIds(List<Long> stepIds) {
        this.stepIds = stepIds;
    }
}
