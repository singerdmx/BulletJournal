package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SelectionMetadataKeyword save(Long selctionId, String keyword) {
        Selection selection = this.selectionDaoJpa.getById(selctionId);
        SelectionMetadataKeyword selectionMetadataKeyword = new SelectionMetadataKeyword();
        selectionMetadataKeyword.setSelection(selection);
        selectionMetadataKeyword.setKeyword(keyword);
        return this.selectionMetadataKeywordRepository.save(selectionMetadataKeyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteByKeyword(String keyword) {
        if (!selectionMetadataKeywordRepository.existsById(keyword)) {
            throw new ResourceNotFoundException("Keyword not found");
        }
        selectionMetadataKeywordRepository.deleteById(keyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SelectionMetadataKeyword updateByKeyword(String keyword, Long selectionId) {
        SelectionMetadataKeyword selectionMetadataKeyword = selectionMetadataKeywordRepository.findById(keyword)
                .orElseThrow(() -> new ResourceNotFoundException("Keyword not found"));
        Selection selection = selectionDaoJpa.getById(selectionId);
        selectionMetadataKeyword.setSelection(selection);
        return selectionMetadataKeywordRepository.save(selectionMetadataKeyword);
    }
}
