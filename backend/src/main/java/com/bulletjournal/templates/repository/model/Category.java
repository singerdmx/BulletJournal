package com.bulletjournal.templates.repository.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "categories", schema = "template")
public class Category {

    @Id
    @Column(name = "onerow_id")
    Integer id = 1;

    @Column(name = "hierarchy", nullable = false)
    String hierarchy;

    public Category() {
    }

    public Category(String hierarchy) {
        this.hierarchy = hierarchy;
    }

    public Integer getId() {
        return id;
    }

    public String getHierarchy() {
        return hierarchy;
    }

    public void setHierarchy(String hierarchy) {
        this.hierarchy = hierarchy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return getId().equals(category.getId()) &&
            getHierarchy().equals(category.getHierarchy());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getHierarchy());
    }
}
