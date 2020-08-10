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
            Objects.equals(getSubCategories(), category.getSubCategories());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getDescription(), getSubCategories());
    }

    @Override
    public String toString() {
        return "Category{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", subCategories=" + subCategories +
            '}';
    }

    public void clone(Category category) {
        this.setId(category.getId());
        this.setName(category.getName());
        this.setDescription(category.getDescription());
    }
}
