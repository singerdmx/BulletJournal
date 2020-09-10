package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@MappedSuperclass
public abstract class Rule extends NamedModel {

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "rule_expression")
    private String ruleExpression;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Step step;

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

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public void clone(Rule rule) {
        setName(rule.getName());
        setPriority(rule.getPriority());
        setRuleExpression(rule.getRuleExpression());
    }
}
