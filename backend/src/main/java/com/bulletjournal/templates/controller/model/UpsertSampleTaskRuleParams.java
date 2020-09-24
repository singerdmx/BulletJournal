package com.bulletjournal.templates.controller.model;

public class UpsertSampleTaskRuleParams {
    private Long stepId;
    private String selectionCombo;
    private String taskIds;

    public UpsertSampleTaskRuleParams(Long stepId, String selectionCombo, String taskIds) {
        this.stepId = stepId;
        this.selectionCombo = selectionCombo;
        this.taskIds = taskIds;
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

    public String getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(String taskIds) {
        this.taskIds = taskIds;
    }
}
