package com.bulletjournal.templates.controller.model;

public class DeleteSampleTaskRuleParams {
    private Long stepId;
    private String selectionCombo;

    public DeleteSampleTaskRuleParams(Long stepId, String selectionCombo) {
        this.stepId = stepId;
        this.selectionCombo = selectionCombo;
    }

    public Long getStepId() {
        return stepId;
    }

    public void setStepId(Long stepId) {
        this.stepId = stepId;
    }

    public String getSelectionCombo() {
        return selectionCombo;
    }

    public void setSelectionCombo(String selectionCombo) {
        this.selectionCombo = selectionCombo;
    }
}
