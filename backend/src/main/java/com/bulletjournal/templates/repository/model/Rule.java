package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;

@MappedSuperclass
public abstract class Rule extends NamedModel {

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "rule_expression")
    private String ruleExpression;

    @Column(name = "connected_step_id")
    private Long connectedStepId;

    public Rule() {
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

    public Long getConnectedStepId() {
        return connectedStepId;
    }

    public void setConnectedStepId(Long connectedStepId) {
        this.connectedStepId = connectedStepId;
    }

    public void clone(Rule rule) {
        setName(rule.getName());
        setPriority(rule.getPriority());
        setRuleExpression(rule.getRuleExpression());
    }
}
