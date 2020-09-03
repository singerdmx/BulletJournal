package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.StepRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepRuleRepository extends JpaRepository<StepRule, Long> {
    StepRule getById(Long id);
}
