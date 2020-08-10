package com.bulletjournal.templates.repository.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "categories_hierarchy", schema = "template")
public class CategoriesHierarchy {

    @Id
    @Column(name = "onerow_id")
    Integer id = 1;

    @Column(name = "hierarchy", nullable = false)
    String hierarchy;

    public CategoriesHierarchy() {
    }

    public CategoriesHierarchy(String hierarchy) {
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
        CategoriesHierarchy categoriesHierarchy = (CategoriesHierarchy) o;
        return getId().equals(categoriesHierarchy.getId()) &&
            getHierarchy().equals(categoriesHierarchy.getHierarchy());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getHierarchy());
    }

    @Override
    public String toString() {
        return "CategoriesHierarchy{" +
            "id=" + id +
            ", hierarchy='" + hierarchy + '\'' +
            '}';
    }
}
