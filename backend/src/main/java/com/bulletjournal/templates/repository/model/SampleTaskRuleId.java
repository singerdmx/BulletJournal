package com.bulletjournal.templates.repository.model;

import java.io.Serializable;

public class SampleTaskRuleId implements Serializable {
    private Step step;
    private String selectionCombo;

    public SampleTaskRuleId() {
    }

    public SampleTaskRuleId(Step step, String selectionCombo) {
        this.step = step;
        this.selectionCombo = selectionCombo;
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
}
