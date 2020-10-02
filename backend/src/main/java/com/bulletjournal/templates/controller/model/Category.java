package com.bulletjournal.templates.controller.model;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class Category {

    @Expose
    private Long id;

    private String name;

    private String description;

    private String icon;

    private String color;

    private Long forumId;

    private String image;

    private List<Choice> choices = new ArrayList<>();

    private List<Rule> rules = new ArrayList<>();

    private Long nextStepId;

    private Boolean needStartDate;

    @Expose
    private List<Category> subCategories = new ArrayList<>();

    public Category() {

    }

    public Category(Long id, String name) {
        this(id, name, null, Collections.emptyList());
    }

    public Category(Long id, String name, String description, List<Category> subCategories) {
        this.id = id;
        this.name = name;
        this.subCategories = subCategories;
        this.description = description;
    }

    public Category(Long id, String name, String description, String icon, String color, Long forumId, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.forumId = forumId;
        this.image = image;
    }

    public Category(Long id, String name, String description, String icon, String color, Long forumId, String image, List<Choice> choices) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.forumId = forumId;
        this.image = image;
        this.choices = choices;
    }

    public Category(Long id, String name, String description, String icon, String color,
                    Long forumId, List<Category> subCategories, String image, List<Choice> choices, List<Rule> rules, Long nextStepId, Boolean needStartDate) {
        this.id = id;
        this.name = name;
        this.subCategories = subCategories;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.forumId = forumId;
        this.image = image;
        this.choices = choices;
        this.rules = rules;
        this.nextStepId = nextStepId;
        this.needStartDate = needStartDate;
    }

    public Boolean getNeedStartDate() {
        return needStartDate;
    }

    public void setNeedStartDate(Boolean needStartDate) {
        this.needStartDate = needStartDate;
    }

    public Long getNextStepId() {
        return nextStepId;
    }

    public void setNextStepId(Long nextStepId) {
        this.nextStepId = nextStepId;
    }

    public List<Rule> getRules() {
        return rules;
    }

    public void setRules(List<Rule> rules) {
        this.rules = rules;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Category> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(List<Category> subCategories) {
        this.subCategories = subCategories;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return Objects.equals(getId(), category.getId()) &&
            Objects.equals(getName(), category.getName()) &&
            Objects.equals(getDescription(), category.getDescription()) &&
            Objects.equals(getIcon(), category.getIcon()) &&
            Objects.equals(getColor(), category.getColor()) &&
            Objects.equals(getForumId(), category.getForumId()) &&
            Objects.equals(getSubCategories(), category.getSubCategories()) &&
            Objects.equals(getChoices(), category.getChoices());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getDescription(), getIcon(), getColor(), getForumId(), getSubCategories(), getChoices());
    }

    @Override
    public String toString() {
        return "Category{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", icon='" + icon + '\'' +
            ", color='" + color + '\'' +
            ", forumId='" + forumId + '\'' +
            ", subCategories=" + subCategories +
            ", choices" + choices +
            '}';
    }

    public void clone(Category category) {
        this.setId(category.getId());
        this.setName(category.getName());
        this.setDescription(category.getDescription());
        this.setColor(category.getColor());
        this.setForumId(category.getForumId());
        this.setIcon(category.getIcon());
        this.setImage(category.getImage());
        this.setChoices(category.getChoices());
    }

    public Step convertToStep() {
        return new Step(id, name);
    }
}
