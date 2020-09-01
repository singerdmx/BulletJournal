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

    @Column(nullable = false)
    private String name;

    @ManyToMany(targetEntity = Choice.class, fetch = FetchType.LAZY)
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
    private Long[] excludedSelections;

    public Step(String name) {
        this.name = name;
    }

    public Step() {

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
        return new com.bulletjournal.templates.controller.model.Step(id, name,
                choices.stream().map(Choice::toPresentationModel).collect(Collectors.toList()));
    }
}
