package com.bulletjournal.templates.controller.model;

public class StepMetadata {
    private String keyword;
    private Step step;

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public StepMetadata() {
    }

    public StepMetadata(String keyword, Step step) {
        this.keyword = keyword;
        this.step = step;
    }
}
