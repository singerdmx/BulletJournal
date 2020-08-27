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
    private Long id;

    @Column(nullable = false)
    private String name;

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

    public Category() {

    }

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Category(String name, String description, String icon, String color, Long forumId, String image) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.forumId = forumId;
        this.image = image;
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
            getIcon().equals(category.getIcon()) &&
            getColor().equals(category.getColor()) &&
            getForumId() == category.getForumId() &&
            getDescription().equals(category.getDescription());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getIcon(), getColor(), getForumId(), getDescription());
    }

    public com.bulletjournal.templates.controller.model.Category toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Category(id, name, description, icon, color, forumId, new ArrayList<>(), image);
    }
}
