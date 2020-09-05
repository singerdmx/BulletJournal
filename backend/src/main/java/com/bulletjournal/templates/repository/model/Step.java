package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "steps", schema = "template")
public class Step extends NamedModel {

    @Id
    @GeneratedValue(generator = "step_generator")
    @SequenceGenerator(name = "step_generator", sequenceName = "template.step_sequence", initialValue = 8000, allocationSize = 10)
    private Long id;

    @ManyToMany(targetEntity = Choice.class, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "choices_steps", schema = "template",
            joinColumns = {
                    @JoinColumn(name = "step_id", referencedColumnName = "id",
                            nullable = false, updatable = false)},
            inverseJoinColumns = {
                    @JoinColumn(name = "choice_id", referencedColumnName = "id",
                            nullable = false, updatable = false)})
    private List<Choice> choices = new ArrayList<>();

    @Type(type = "long-array")
    @Column(
            name = "excluded_selections",
            columnDefinition = "bigint[]"
    )
    private Long[] excludedSelections = new Long[0];

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "next_step", referencedColumnName = "id")
    private Step nextStep;

    public Step(String name) {
        super.setName(name);
    }

    public Step() {

    }

    public Step getNextStep() {
        return nextStep;
    }

    public void setNextStep(Step nextStep) {
        this.nextStep = nextStep;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    public Long[] getExcludedSelections() {
        return excludedSelections;
    }

    public void setExcludedSelections(Long[] excludedSelections) {
        this.excludedSelections = excludedSelections;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public com.bulletjournal.templates.controller.model.Step toPresentationModel() {
        if (nextStep == null) {
            return new com.bulletjournal.templates.controller.model.Step(id, getName(),
                    choices.stream().map(Choice::toPresentationModel).collect(Collectors.toList()));
        }
        return new com.bulletjournal.templates.controller.model.Step(id, getName(),
                choices.stream().map(Choice::toPresentationModel).collect(Collectors.toList()), nextStep.toPresentationModel());
    }
}
