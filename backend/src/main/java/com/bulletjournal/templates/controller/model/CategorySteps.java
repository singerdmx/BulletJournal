package com.bulletjournal.templates.controller.model;

import org.apache.commons.lang3.tuple.Triple;

import java.util.ArrayList;
import java.util.List;

public class CategorySteps {

    /*
        Step: from
        Rule: rule (can be null)
        Step: to
     */
    private List<Triple<Step, Rule, Step>> connections = new ArrayList<>();

    private List<Step> finalSteps; // contains Map<SelectionCombo, List<SampleTask>>

    public List<Triple<Step, Rule, Step>> getConnections() {
        return connections;
    }

    public void setConnections(List<Triple<Step, Rule, Step>> connections) {
        this.connections = connections;
    }

    public List<Step> getFinalSteps() {
        return finalSteps;
    }

    public void setFinalSteps(List<Step> finalSteps) {
        this.finalSteps = finalSteps;
    }
}
