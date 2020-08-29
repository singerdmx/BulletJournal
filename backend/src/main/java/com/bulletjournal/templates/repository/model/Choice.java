package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "choices", schema = "template")
public class Choice extends AuditModel {
    @Id
    @GeneratedValue(generator = "choice_generator")
    @SequenceGenerator(name = "choice_generator",
            sequenceName = "template.choice_sequence",
            initialValue = 100,
            allocationSize = 2)
    private Long id;

    @OneToMany(mappedBy = "choice", fetch = FetchType.LAZY)
    private List<Selection> selections;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinTable(name = "choices_categories", schema = "template",
        joinColumns = {
            @JoinColumn(name = "choice_id", referencedColumnName = "id",
                nullable = false, updatable = false)},
        inverseJoinColumns = {
            @JoinColumn(name = "category_id", referencedColumnName = "id",
                nullable = false, updatable = false)})
    private List<Category> categories = new ArrayList<>();

    @Column(name = "name", nullable = false)
    private String name;

    // multiple selections or single selection
    @Column(name = "multiple", nullable = false)
    private boolean multiple;

    public Choice() {
    }

    public Choice(List<Selection> selections, boolean multiple, String name) {
        this.selections = selections;
        this.multiple = multiple;
        this.name = name;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
        return new com.bulletjournal.templates.controller.model.Choice(id, name, multiple);
    }
}
