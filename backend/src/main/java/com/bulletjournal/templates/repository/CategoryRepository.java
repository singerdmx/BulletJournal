package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category getByName(String name);

    Category getById(Long id);
}
