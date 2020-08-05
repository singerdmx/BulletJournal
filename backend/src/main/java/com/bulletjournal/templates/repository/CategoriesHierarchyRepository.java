package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.CategoriesHierarchy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoriesHierarchyRepository extends JpaRepository<CategoriesHierarchy, Integer> {

    @Query("SELECT c from CategoriesHierarchy c WHERE c.id = 1")
    CategoriesHierarchy getCategoriesHierarchy();
}
