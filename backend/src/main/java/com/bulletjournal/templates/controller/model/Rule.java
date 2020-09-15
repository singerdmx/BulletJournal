package com.bulletjournal.templates.controller.model;

public class Rule {

    private Long id;

    private String name;

    private Integer priority;

    private String ruleExpression;

    private CategoryInfo categoryInfo;

    private StepInfo stepInfo;

    public Rule() {
    }

    public Rule(Long id, String name, Integer priority, String ruleExpression, CategoryInfo categoryInfo, StepInfo stepInfo) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.ruleExpression = ruleExpression;
        this.categoryInfo = categoryInfo;
        this.stepInfo = stepInfo;
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

    public CategoryInfo getCategoryInfo() {
        return categoryInfo;
    }

    public void setCategoryInfo(CategoryInfo categoryInfo) {
        this.categoryInfo = categoryInfo;
    }

    public StepInfo getStepInfo() {
        return stepInfo;
    }

    public void setStepInfo(StepInfo stepInfo) {
        this.stepInfo = stepInfo;
    }
}
