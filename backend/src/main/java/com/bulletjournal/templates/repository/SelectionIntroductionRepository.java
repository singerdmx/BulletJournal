package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SelectionIntroduction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelectionIntroductionRepository extends JpaRepository<SelectionIntroduction, Long> {
    SelectionIntroduction getById(Long id);
}
