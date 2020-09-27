package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SelectionMetadataKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelectionMetadataKeywordRepository extends JpaRepository<SelectionMetadataKeyword, String> {
}
