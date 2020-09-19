package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@MappedSuperclass
public abstract class Rule extends RuleModel {

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

    public void clone(Rule rule) {
        setName(rule.getName());
        setPriority(rule.getPriority());
        setRuleExpression(rule.getRuleExpression());
    }
}
