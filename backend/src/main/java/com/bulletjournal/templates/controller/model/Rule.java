package com.bulletjournal.templates.controller.model;

public class Rule {

    private Long id;

    private String name;

    private Integer priority;

    private String ruleExpression;

    private Category category;

    private Step step;

    private Step connectedStep;

    public Rule() {
    }

    public Rule(Long id, String name, Integer priority, String ruleExpression, Category category, Step step, Step connectedStep) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.ruleExpression = ruleExpression;
        this.category = category;
        this.step = step;
        this.connectedStep = connectedStep;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getRuleExpression() {
        return ruleExpression;
    }

    public void setRuleExpression(String ruleExpression) {
        this.ruleExpression = ruleExpression;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public Step getConnectedStep() {
        return connectedStep;
    }

    public void setConnectedStep(Step connectedStep) {
        this.connectedStep = connectedStep;
    }
}
