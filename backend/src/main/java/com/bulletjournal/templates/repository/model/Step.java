package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;
import org.hibernate.annotations.Type;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "steps", schema = "template")
public class Step extends NamedModel {

    @Id
    @GeneratedValue(generator = "step_generator")
    @SequenceGenerator(name = "step_generator", sequenceName = "template.step_sequence", initialValue = 8000, allocationSize = 10)
    private Long id;

    @ManyToMany(targetEntity = Choice.class, fetch = FetchType.LAZY)
    @JoinTable(name = "choices_steps", schema = "template",
            joinColumns = {
                    @JoinColumn(name = "step_id", referencedColumnName = "id",
                            nullable = false, updatable = false)},
            inverseJoinColumns = {
                    @JoinColumn(name = "choice_id", referencedColumnName = "id",
                            nullable = false, updatable = false)})
    private List<Choice> choices;

    @Type(type = "long-array")
    @Column(
            name = "excluded_selections",
            columnDefinition = "bigint[]"
    )
    private Long[] excludedSelections;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "next_step", referencedColumnName = "id")
    private Step nextStep;

    @OneToMany(mappedBy = "step", fetch = FetchType.LAZY)
    private List<StepRule> stepRules = new ArrayList<>();

    @OneToMany(mappedBy = "step", fetch = FetchType.LAZY)
    private List<SampleTaskRule> sampleTaskRules = new ArrayList<>();

    @Column(name = "choice_order")
    private String choiceOrder;

    public Step(String name) {
        super.setName(name);
    }

    public Step() {

    }

    public String getChoiceOrder() {
        return choiceOrder;
    }

    public void setChoiceOrder(String choiceOrder) {
        this.choiceOrder = choiceOrder;
    }

    public void setChoiceOrder(List<Long> choicesIds) {
        this.choiceOrder = choicesIds
                .stream().distinct().map(choicesId -> Long.toString(choicesId)).collect(Collectors.joining(","));
    }

    public List<Long> getChoiceOrderById() {
        if (choiceOrder == null || choiceOrder.isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(choiceOrder.split(",")).map(Long::parseLong).collect(Collectors.toList());
    }

    public List<StepRule> getStepRules() {
        if (stepRules == null) {
            return Collections.emptyList();
        }
        return stepRules;
    }

    public void setStepRules(List<StepRule> stepRules) {
        this.stepRules = stepRules;
    }

    public Step getNextStep() {
        return nextStep;
    }

    public void setNextStep(Step nextStep) {
        this.nextStep = nextStep;
    }

    public List<Choice> getChoices() {
        if (choices == null) {
            return Collections.emptyList();
        }
        choices = choices.stream().distinct().collect(Collectors.toList());
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices.stream().distinct().collect(Collectors.toList());
    }

    public List<Long> getExcludedSelections() {
        if (this.excludedSelections == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(this.excludedSelections);
    }

    public void setExcludedSelections(List<Long> excludedSelections) {
        this.excludedSelections = excludedSelections == null ? null : excludedSelections.toArray(new Long[0]);
    }

    public List<SampleTaskRule> getSampleTaskRules() {
        return sampleTaskRules == null ? Collections.emptyList() : sampleTaskRules;
    }

    public void setSampleTaskRules(List<SampleTaskRule> sampleTaskRules) {
        this.sampleTaskRules = sampleTaskRules;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public com.bulletjournal.templates.controller.model.Step toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Step(id, getName(),
                getChoices().stream().map(Choice::toPresentationModel).collect(Collectors.toList()),
                getStepRules().stream().map(StepRule::toPresentationModel).collect(Collectors.toList()),
                getExcludedSelections());
    }

    public void clone(Step oldStep) {

        this.setName(oldStep.getName());
        this.setNextStep(oldStep.getNextStep());
        this.setExcludedSelections(oldStep.getExcludedSelections());
        this.setChoices(oldStep.getChoices());

        List<StepRule> clonedStepRules = new ArrayList<>();
         for (StepRule rule : oldStep.getStepRules()) {
            StepRule newRule = new StepRule();
            newRule.clone(rule);
            newRule.setStep(this);
            clonedStepRules.add(newRule);
        }

        List<SampleTaskRule> clonedSampleTaskRules = new ArrayList<>();
        for (SampleTaskRule rule : oldStep.getSampleTaskRules()) {
            SampleTaskRule newRule = new SampleTaskRule();
            newRule.clone(rule);
            newRule.setStep(this);
            clonedSampleTaskRules.add(newRule);
        }

        this.setStepRules(clonedStepRules);
        this.setSampleTaskRules(clonedSampleTaskRules);
    }
}
