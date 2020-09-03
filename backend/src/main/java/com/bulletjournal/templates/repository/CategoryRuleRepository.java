package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.CategoryRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRuleRepository extends JpaRepository<CategoryRule, Long> {
    CategoryRule getById(Long id);
}
