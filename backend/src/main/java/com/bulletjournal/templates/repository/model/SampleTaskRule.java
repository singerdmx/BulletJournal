package com.bulletjournal.templates.repository.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "sample_task_rules", schema = "template")
public class SampleTaskRule extends TaskRule {
    @Id
    @GeneratedValue(generator = "sample_task_rule_generator")
    @SequenceGenerator(name = "sample_task_rule_generator", sequenceName = "template.sample_task_rule_sequence", initialValue = 100, allocationSize = 2)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Step step;

    @Column(name = "selection_combo", nullable = false)
    private String selectionCombo;

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

    public String getSelectionCombo() {
        return selectionCombo;
    }

    public void setSelectionCombo(String selectionCombo) {
        this.selectionCombo = selectionCombo;
    }
}
