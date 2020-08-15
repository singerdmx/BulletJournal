package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Objects;

@Entity
@Table(name = "categories", schema = "template")
public class Category extends AuditModel {

    @Id
    @GeneratedValue(generator = "category_generator")
    @SequenceGenerator(name = "category_generator", sequenceName = "template.category_sequence", initialValue = 100, allocationSize = 2)
    Long id;

    @Column(nullable = false)
    String name;

    @Column
    String description;

    public Category() {

    }

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return getId().equals(category.getId()) &&
            getName().equals(category.getName()) &&
            getDescription().equals(category.getDescription());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getDescription());
    }

    public com.bulletjournal.templates.controller.model.Category toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Category(id, name, description, new ArrayList<>());
    }
}
