package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.util.*;
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

    @ManyToMany(targetEntity = Choice.class, fetch = FetchType.LAZY)
    @JoinTable(name = "choices_categories", schema = "template",
            joinColumns = {
                    @JoinColumn(name = "category_id", referencedColumnName = "id",
                            nullable = false, updatable = false)},
            inverseJoinColumns = {
                    @JoinColumn(name = "choice_id", referencedColumnName = "id",
                            nullable = false, updatable = false)})
    private List<Choice> choices;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<CategoryRule> categoryRules;

    @Column(name = "choice_order")
    private String choiceOrder;

    @Column(name = "need_start_date", nullable = false, columnDefinition = "boolean default false")
    private Boolean needStartDate;

    public Category() {

    }

    public Category(String name, String description, String icon, String color, Long forumId, String image, Step nextStep, Boolean needStartDate) {
        setName(name);
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.forumId = forumId;
        this.image = image;
        this.nextStep = nextStep;
        this.needStartDate = needStartDate;
    }

    public Boolean getNeedStartDate() {
        return needStartDate;
    }

    public void setNeedStartDate(Boolean needStartDate) {
        this.needStartDate = needStartDate;
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

    public List<CategoryRule> getCategoryRules() {
        if (categoryRules == null) {
            return Collections.emptyList();
        }
        return categoryRules;
    }

    public void setCategoryRules(List<CategoryRule> categoryRules) {
        this.categoryRules = categoryRules;
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
        return new com.bulletjournal.templates.controller.model.Category(
                id, getName(), description, icon, color, forumId, Collections.emptyList(), image,
                getChoices().stream().map(Choice::toPresentationModel).collect(Collectors.toList()),
                getCategoryRules().stream().map(CategoryRule::toPresentationModel).collect(Collectors.toList()),
                nextStep == null ? null : nextStep.getId(), needStartDate);
    }

    public com.bulletjournal.templates.controller.model.Category toSimplePresentationModel() {
        return new com.bulletjournal.templates.controller.model.Category(
            id, getName(), description, icon, color, forumId, Collections.emptyList(), image,
            Collections.emptyList(), Collections.emptyList(), null, needStartDate
        );
    }
}
