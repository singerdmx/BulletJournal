package com.bulletjournal.templates.controller.model;

public class UpdateStepMetadataKeywordsParams {
    private Long stepId;

    public UpdateStepMetadataKeywordsParams() {
    }

    public UpdateStepMetadataKeywordsParams(Long stepId) {
        this.stepId = stepId;
    }

    public Long getStepId() {
        return stepId;
    }

    public void setStepId(Long stepId) {
        this.stepId = stepId;
    }
}
