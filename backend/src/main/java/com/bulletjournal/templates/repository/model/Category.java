package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Entity
@Table(name = "categories", schema = "template")
public class Category extends NamedModel {

    @Id
    @GeneratedValue(generator = "category_generator")
    @SequenceGenerator(name = "category_generator", sequenceName = "template.category_sequence", initialValue = 100, allocationSize = 2)
    private Long id;

    @Column
    private String description;

    @Column(name = "icon", length = 30)
    private String icon;

    @Column(name = "color", length = 30)
    private String color;

    @Column(name = "forum_id")
    private Long forumId;

    @Column(name = "image")
    private String image;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "next_step", referencedColumnName = "id")
    private Step nextStep;

    @ManyToMany(targetEntity = Choice.class, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "choices_categories", schema = "template",
            joinColumns = {
                    @JoinColumn(name = "category_id", referencedColumnName = "id",
                            nullable = false, updatable = false)},
            inverseJoinColumns = {
                    @JoinColumn(name = "choice_id", referencedColumnName = "id",
                            nullable = false, updatable = false)})
    private List<Choice> choices = new ArrayList<>();

    public Category() {

    }

    public Category(String name, String description, String icon, String color, Long forumId, String image, Step nextStep) {
        setName(name);
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.forumId = forumId;
        this.image = image;
        this.nextStep = nextStep;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getForumId() {
        return forumId;
    }

    public void setForumId(Long forumId) {
        this.forumId = forumId;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return getId().equals(category.getId()) &&
                getName().equals(category.getName()) &&
                getIcon().equals(category.getIcon()) &&
                getColor().equals(category.getColor()) &&
                getForumId() == category.getForumId() &&
                getDescription().equals(category.getDescription()) &&
                getChoices().equals(category.getChoices());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getIcon(), getColor(), getForumId(), getDescription(), getChoices());
    }

    public com.bulletjournal.templates.controller.model.Category toPresentationModel() {
        if (nextStep == null) {
            return new com.bulletjournal.templates.controller.model.Category(
                    id, getName(), description, icon, color, forumId, image,
                    choices.stream().map(Choice::toPresentationModel).collect(Collectors.toList()));
        }
        return new com.bulletjournal.templates.controller.model.Category(
                id, getName(), description, icon, color, forumId, image,
                choices.stream().map(Choice::toPresentationModel).collect(Collectors.toList()), nextStep.toPresentationModel());
    }
}
