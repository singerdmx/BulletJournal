package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.StepMetadataKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepMetadataKeywordRepository extends JpaRepository<StepMetadataKeyword, String> {
}
