package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Selection;
import com.bulletjournal.templates.repository.model.SelectionIntroduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SelectionIntroductionRepository extends JpaRepository<SelectionIntroduction, Long> {
    List<SelectionIntroduction> findBySelectionIn(List<Selection> selections);
}
