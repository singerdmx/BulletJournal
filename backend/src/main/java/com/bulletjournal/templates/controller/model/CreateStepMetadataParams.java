package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateStepMetadataParams {
    @NotNull
    private String keyword;
    @NotNull
    private Long stepId;

    public CreateStepMetadataParams() {
    }

    public CreateStepMetadataParams(@NotNull String keyword, @NotNull Long stepId) {
        this.keyword = keyword;
        this.stepId = stepId;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Long getStepId() {
        return stepId;
    }

    public void setStepId(Long stepId) {
        this.stepId = stepId;
    }
}
