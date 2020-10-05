package com.bulletjournal.templates.controller.model;

import java.util.ArrayList;
import java.util.List;

public class SampleTaskRuleView extends SampleTaskRule {
    private List<Selection> selections = new ArrayList<>();
    private List<SampleTask> tasks = new ArrayList<>();

    public SampleTaskRuleView() {
    }

    public SampleTaskRuleView(SampleTaskRule sampleTaskRule) {
        this.setStep(sampleTaskRule.getStep());
        this.setSelectionCombo(sampleTaskRule.getSelectionCombo());
        this.setTaskIds(sampleTaskRule.getTaskIds());
    }

    public List<Selection> getSelections() {
        return selections;
    }

    public List<Selection> addSelection(Selection selection) {
        this.selections.add(selection);
        return selections;
    }

    public void setSelections(List<Selection> selections) {
        this.selections = selections;
    }

    public List<SampleTask> getTasks() {
        return tasks;
    }

    public List<SampleTask> addTask(SampleTask sampleTask) {
        this.tasks.add(sampleTask);
        return tasks;
    }

    public void setTasks(List<SampleTask> tasks) {
        this.tasks = tasks;
    }
}
