package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.CategoryHierarchy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoryRepository extends JpaRepository<CategoryHierarchy, Integer> {

    @Query("SELECT c from CategoryHierarchy c WHERE c.id = 1")
    CategoryHierarchy getCategories();
}
