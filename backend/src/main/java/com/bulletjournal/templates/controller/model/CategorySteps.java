package com.bulletjournal.templates.controller.model;

import com.bulletjournal.templates.workflow.models.SelectionCombo;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CategorySteps {

    /*
        Step: from
        Rule: rule (can be null)
        Step: to
     */
    private List<Triple<Step, Rule, Step>> connections = new ArrayList<>();

    private List<Pair<Step, Map<SelectionCombo, List<SampleTask>>>> finalSteps = new ArrayList<>();

    private List<Long> stepIds = new ArrayList<>();

    public List<Triple<Step, Rule, Step>> getConnections() {
        return connections;
    }

    public void setConnections(List<Triple<Step, Rule, Step>> connections) {
        this.connections = connections;
    }

    public List<Pair<Step, Map<SelectionCombo, List<SampleTask>>>> getFinalSteps() {
        return finalSteps;
    }

    public void setFinalSteps(List<Pair<Step, Map<SelectionCombo, List<SampleTask>>>> finalSteps) {
        this.finalSteps = finalSteps;
    }

    public List<Long> getStepIds() {
        return stepIds;
    }

    public void setStepIds(List<Long> stepIds) {
        this.stepIds = stepIds;
    }
}
