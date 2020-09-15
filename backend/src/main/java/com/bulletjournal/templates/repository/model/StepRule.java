package com.bulletjournal.templates.repository.model;


import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "step_rules", schema = "template")
public class StepRule extends Rule {
    @Id
    @GeneratedValue(generator = "step_rule_generator")
    @SequenceGenerator(name = "step_rule_generator", sequenceName = "template.step_rule_sequence", initialValue = 100, allocationSize = 2)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Step step;

    public StepRule() {
    }

    @Override
    public Long getId() {
        return id;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public com.bulletjournal.templates.controller.model.Rule toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Rule(id, getName(), getPriority(), getRuleExpression(),
                null, new com.bulletjournal.templates.controller.model.Step(getId(), getName()),
                new com.bulletjournal.templates.controller.model.Step(getConnectedStep().getId(), getConnectedStep().getName()));
    }
}
