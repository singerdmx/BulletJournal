package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {
    Choice getById(Long id);
    Choice getByName(String name);
}
