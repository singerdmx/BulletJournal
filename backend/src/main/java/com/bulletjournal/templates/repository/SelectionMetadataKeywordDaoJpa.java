package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Selection;
import com.bulletjournal.templates.repository.model.SelectionMetadataKeyword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Repository
public class SelectionMetadataKeywordDaoJpa {

    @Autowired
    private SelectionMetadataKeywordRepository selectionMetadataKeywordRepository;

    @Autowired
    private SelectionDaoJpa selectionDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<SelectionMetadataKeyword> getKeywordsBySelections(Collection<Long> ids) {
        List<Selection> selections = this.selectionDaoJpa.getSelectionsById(ids);
        List<SelectionMetadataKeyword> keywords = this.selectionMetadataKeywordRepository
                .findBySelectionIn(selections);
        return keywords;
    }
}
