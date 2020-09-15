package com.bulletjournal.templates.controller.model;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;

import java.util.ArrayList;
import java.util.List;

public class CategorySteps {

    /*
        Step: from
        Rule: rule (can be null)
        Step: to
     */
    List<Triple<Step, Rule, Step>> connections = new ArrayList<>();

    Pair<Step, List<SampleTask>> finalStep;

    public List<Triple<Step, Rule, Step>> getConnections() {
        return connections;
    }

    public void setConnections(List<Triple<Step, Rule, Step>> connections) {
        this.connections = connections;
    }

    public Pair<Step, List<SampleTask>> getFinalStep() {
        return finalStep;
    }

    public void setFinalStep(Pair<Step, List<SampleTask>> finalStep) {
        this.finalStep = finalStep;
    }
}
