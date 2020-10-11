package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Selection;
import com.bulletjournal.templates.repository.model.SelectionMetadataKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SelectionMetadataKeywordRepository extends JpaRepository<SelectionMetadataKeyword, String> {
    List<SelectionMetadataKeyword> findBySelectionIn(List<Selection> selections);

    List<SelectionMetadataKeyword> findByFrequencyNullAndSelectionIn(List<Selection> selections);

    List<SelectionMetadataKeyword> findByFrequencyNotNullAndSelectionIn(List<Selection> selections);
}
