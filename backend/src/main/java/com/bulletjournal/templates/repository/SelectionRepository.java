package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.Selection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SelectionRepository extends JpaRepository<Selection, Long> {
    boolean existsSelectionByChoiceAndText(Choice choice, String text);

    List<Selection> getAllByChoiceId(Long choiceId);
}
