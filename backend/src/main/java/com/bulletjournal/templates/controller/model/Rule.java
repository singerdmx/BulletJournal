package com.bulletjournal.templates.controller.model;

public class Rule {

    private Long id;

    private String name;

    private Integer priority;

    private String ruleExpression;

    private Category category;

    private Step step;

    public Rule() {
    }

    public Rule(Long id, String name, Integer priority, String ruleExpression, Category category) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.ruleExpression = ruleExpression;
        this.category = category;
    }

    public Rule(Long id, String name, Integer priority, String ruleExpression, Step step) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.ruleExpression = ruleExpression;
        this.step = step;
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

    public Integer getOrder() {
        return priority;
    }

    public void setOrder(Integer order) {
        this.priority = order;
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
}
