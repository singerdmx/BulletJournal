package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Selection;
import com.bulletjournal.templates.repository.model.SelectionMetadataKeyword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
    public List<SelectionMetadataKeyword> getKeywordsBySelectionsWithoutFrequency(Collection<Long> ids) {
        List<Selection> selections = this.selectionDaoJpa.getSelectionsById(ids);
        List<SelectionMetadataKeyword> keywords = this.selectionMetadataKeywordRepository
                .findByFrequencyNullAndSelectionIn(selections);
        if (keywords.isEmpty()) {
            keywords = this.selectionMetadataKeywordRepository.findBySelectionIn(selections);
        }
        return keywords;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<SelectionMetadataKeyword> getFrequencyBySelections(Collection<Long> ids) {
        List<Selection> selections = this.selectionDaoJpa.getSelectionsById(ids);
        List<SelectionMetadataKeyword> keywords = this.selectionMetadataKeywordRepository
                .findByFrequencyNotNullAndSelectionIn(selections);
        return keywords;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SelectionMetadataKeyword save(Long selctionId, String keyword, Integer frequency) {
        Selection selection = this.selectionDaoJpa.getById(selctionId);
        SelectionMetadataKeyword selectionMetadataKeyword = new SelectionMetadataKeyword();
        selectionMetadataKeyword.setSelection(selection);
        selectionMetadataKeyword.setKeyword(keyword);
        selectionMetadataKeyword.setFrequency(frequency);
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
    public SelectionMetadataKeyword updateByKeyword(String keyword, Long selectionId, Integer frequency) {
        SelectionMetadataKeyword selectionMetadataKeyword = selectionMetadataKeywordRepository.findById(keyword)
                .orElseThrow(() -> new ResourceNotFoundException("Keyword not found"));
        Selection selection = selectionDaoJpa.getById(selectionId);
        selectionMetadataKeyword.setSelection(selection);
        selectionMetadataKeyword.setFrequency(frequency);
        return selectionMetadataKeywordRepository.save(selectionMetadataKeyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteByKeywords(List<String> keywords) {
        if (keywords.isEmpty()) {
            throw new BadRequestException("keywords is empty");
        }
        List<SelectionMetadataKeyword> list = selectionMetadataKeywordRepository.findAllById(keywords)
                .stream().filter(Objects::nonNull).collect(Collectors.toList());
        selectionMetadataKeywordRepository.deleteAll(list);
    }
}
