package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    public Choice() {
    }

    public Choice(List<Selection> selections, boolean multiple, String name) {
        this.selections = selections;
        this.multiple = multiple;
        setName(name);
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
        return selections;
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

    public com.bulletjournal.templates.controller.model.Choice toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Choice(id, getName(), multiple);
    }
}
