package com.bulletjournal.templates.repository.model;


import javax.persistence.*;

@Entity
@Table(name = "step_rules", schema = "template")
public class StepRule extends Rule {
    @Id
    @GeneratedValue(generator = "step_rule_generator")
    @SequenceGenerator(name = "step_rule_generator", sequenceName = "template.step_rule_sequence", initialValue = 100, allocationSize = 2)
    private Long id;

    public StepRule() {
    }

    @Override
    public Long getId() {
        return id;
    }

    public com.bulletjournal.templates.controller.model.Rule toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Rule(id, getName(), getPriority(), getRuleExpression(), getStep().toPresentationModel());
    }
}
