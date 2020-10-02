package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.ChoiceMetadataKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChoiceMetadataKeywordRepository extends JpaRepository<ChoiceMetadataKeyword, String> {
    ChoiceMetadataKeyword findByChoice(Choice choice);
}


