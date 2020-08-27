package com.bulletjournal.templates.controller.model;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
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

    @Expose
    private List<Category> subCategories = new ArrayList<>();

    public Category() {

    }

    public Category(Long id, String name, String description, List<Category> subCategories) {
        this.id = id;
        this.name = name;
        this.subCategories = subCategories;
        this.description = description;
    }

    public Category(Long id, String name, String description, String icon, String color, Long forumId, List<Category> subCategories, String image) {
        this.id = id;
        this.name = name;
        this.subCategories = subCategories;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.forumId = forumId;
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
            Objects.equals(getSubCategories(), category.getSubCategories());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getDescription(), getIcon(), getColor(), getForumId(), getSubCategories());
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
            '}';
    }

    public void clone(Category category) {
        this.setId(category.getId());
        this.setName(category.getName());
        this.setDescription(category.getDescription());
        this.setColor(category.getColor());
        this.setForumId(category.getForumId());
        this.setIcon(category.getIcon());
    }
}
