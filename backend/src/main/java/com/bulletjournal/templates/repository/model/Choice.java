package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Entity
@Table(name = "choices", schema = "template")
public class Choice extends NamedModel {
    @Id
    @GeneratedValue(generator = "choice_generator")
    @SequenceGenerator(name = "choice_generator",
            sequenceName = "template.choice_sequence",
            initialValue = 100,
            allocationSize = 2)
    private Long id;

    @OneToMany(mappedBy = "choice", fetch = FetchType.LAZY)
    private List<Selection> selections;

    @ManyToMany(targetEntity = Category.class, mappedBy = "choices", fetch = FetchType.LAZY)
    private List<Category> categories = new ArrayList<>();

    // multiple selections or single selection
    @Column(name = "multiple", nullable = false)
    private boolean multiple;

    @Column(name = "instructionIncluded", nullable = false)
    private boolean instructionIncluded;

    @ManyToMany(targetEntity = Step.class, mappedBy = "choices", fetch = FetchType.LAZY)
    private List<Step> steps = new ArrayList<>();

    public Choice() {
    }

    public Choice(String name, boolean multiple) {
        setName(name);
        this.multiple = multiple;
        // set instructionIncluded false as default
        this.instructionIncluded = false;
    }

    public Choice(String name, boolean multiple, boolean instructionIncluded) {
        setName(name);
        this.multiple = multiple;
        this.instructionIncluded = instructionIncluded;
    }

    public Choice(List<Selection> selections, boolean multiple, String name) {
        this.selections = selections;
        this.multiple = multiple;
        setName(name);
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<Selection> getSelections() {
        if (this.selections == null) {
            return Collections.emptyList();
        }
        return this.selections;
    }

    public void addSelections(List<Selection> selections) {
        this.selections.addAll(selections);
    }

    public void setSelections(List<Selection> selections) {
        this.selections = selections;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }

    public boolean isInstructionIncluded() {
        return instructionIncluded;
    }

    public void setInstructionIncluded(boolean instructionIncluded) {
        this.instructionIncluded = instructionIncluded;
    }

    public com.bulletjournal.templates.controller.model.Choice toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Choice(getId(), getName(), isMultiple(), isInstructionIncluded(),
                getSelections().stream()
                        .map(Selection::toPresentationModel)
                        .collect(Collectors.toList()));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Choice choice = (Choice) o;
        return Objects.equals(getId(), choice.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
