package com.bulletjournal.templates.controller.model;

public class UpdateStepParams {

    private String name;

    private Long nextStepId;

    public Long getNextStepId() {
        return nextStepId;
    }

    public void setNextStepId(Long nextStepId) {
        this.nextStepId = nextStepId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
