package com.bulletjournal.templates.controller.model;

public class SampleTaskRule {
    private Step step;
    private String selectionCombo;
    private String taskIds;

    public SampleTaskRule() {
    }

    public SampleTaskRule(Step step, String selectionCombo, String taskIds) {
        this.step = step;
        this.selectionCombo = selectionCombo;
        this.taskIds = taskIds;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public String getSelectionCombo() {
        return selectionCombo;
    }

    public void setSelectionCombo(String selectionCombo) {
        this.selectionCombo = selectionCombo;
    }

    public String getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(String taskIds) {
        this.taskIds = taskIds;
    }
}
