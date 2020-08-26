package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Selection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelectionRepository extends JpaRepository<Selection, Long> {
}
