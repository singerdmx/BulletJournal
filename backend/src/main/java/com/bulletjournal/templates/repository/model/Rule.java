package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@MappedSuperclass
public abstract class Rule extends NamedModel {

    @Column(name = "priority", nullable = false)
    private Integer priority;

    @Column(name = "rule_expression")
    private String ruleExpression;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "connected_step_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Step connectedStep;

    public Rule() {
    }

    public Step getConnectedStep() {
        return connectedStep;
    }

    public void setConnectedStep(Step connectedStep) {
        this.connectedStep = connectedStep;
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

    public void clone(Rule rule) {
        setName(rule.getName());
        setPriority(rule.getPriority());
        setRuleExpression(rule.getRuleExpression());
    }
}
