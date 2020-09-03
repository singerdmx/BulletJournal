package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {
    Step getById(Long id);
}
