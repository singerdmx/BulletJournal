package com.bulletjournal.templates.controller.model;

public class UpdateRuleParams {

    private Long categoryId;

    private Long stepId;

    private String ruleExpression;

    private String name;

    private Integer priority;

    private Long connectedStepId;

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getStepId() {
        return stepId;
    }

    public void setStepId(Long stepId) {
        this.stepId = stepId;
    }

    public String getRuleExpression() {
        return ruleExpression;
    }

    public void setRuleExpression(String ruleExpression) {
        this.ruleExpression = ruleExpression;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Long getConnectedStepId() {
        return connectedStepId;
    }

    public void setConnectedStepId(Long connectedStepId) {
        this.connectedStepId = connectedStepId;
    }
}
