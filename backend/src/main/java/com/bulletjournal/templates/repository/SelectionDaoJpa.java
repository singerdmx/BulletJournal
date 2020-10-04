package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.Selection;
import com.bulletjournal.templates.repository.model.SelectionIntroduction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class SelectionDaoJpa {
    @Autowired
    private SelectionRepository selectionRepository;
    @Autowired
    private ChoiceRepository choiceRepository;
    @Autowired
    private SelectionIntroductionRepository selectionIntroductionRepository;
    @Autowired
    private ChoiceDaoJpa choiceDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Selection save(Long choiceId, String icon, String text) {
        Optional<Choice> choiceById = choiceRepository.findById(choiceId);
        if (!choiceById.isPresent()) {
            throw new ResourceNotFoundException("Choice with choiceId" + choiceId + "does not exist");
        }
        Choice choice = choiceById.get();

        if (selectionRepository.existsSelectionByChoiceAndText(choice, text)) {
            throw new ResourceAlreadyExistException("Selection with choiceId " + choiceId + " and text " + text + "  already exists.");
        }

        Selection selection = new Selection(choice, icon, text);
        return this.selectionRepository.save(selection);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Selection save(Selection selection) {
        return this.selectionRepository.save(selection);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Selection getById(Long id) {
        Optional<Selection> selection = selectionRepository.findById(id);
        if (!selection.isPresent()) {
            throw new ResourceNotFoundException("Selection with id " + id + " doesn't exist");
        }
        return selection.get();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Selection> getSelectionsById(Collection<Long> ids) {
        if (ids.isEmpty()) {
            return Collections.emptyList();
        }
        return selectionRepository.findAllById(ids).stream().filter(Objects::nonNull).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteById(Long id) {
        if (!this.selectionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Selection with id: " + id + " doesn't exist, cannot delete.");
        }
        selectionRepository.deleteById(id);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Long saveSelectionIntroduction(
            Long selectionId, String imageLink, String description, String title) {
        Selection selection = this.selectionRepository.findById(selectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Id not found"));
        SelectionIntroduction selectionIntroduction = new SelectionIntroduction();
        selectionIntroduction.setSelection(selection);
        selectionIntroduction.setImageLink(imageLink);
        selectionIntroduction.setDescription(description);
        selectionIntroduction.setTitle(title);
        selectionIntroductionRepository.save(selectionIntroduction);
        return selection.getChoice().getId();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.templates.controller.model.SelectionIntroduction> getSelectionIntroductionsByChoiceId(Long choiceId) {
        Choice choice = choiceDaoJpa.getById(choiceId);
        List<Selection> selections = choice.getSelections();
        List<SelectionIntroduction> introductions = selectionIntroductionRepository.findBySelectionIn(selections);
        if (introductions == null) {
            throw new ResourceNotFoundException("There is no selection introductions in the choice");
        }
        return introductions.stream().map(com.bulletjournal.templates.repository.model.SelectionIntroduction::toPresentationModel).collect(Collectors.toList());

    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteIntroductionById(Long selectionIntroductionId) {
        if (!this.selectionIntroductionRepository.existsById(selectionIntroductionId)) {
            throw new ResourceNotFoundException("Selection Introduction with id: " + selectionIntroductionId + " doesn't exist, cannot delete.");
        }
        selectionIntroductionRepository.deleteById(selectionIntroductionId);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public long updateSelectionIntroduction(long selectionIntroductionId, String imageLink, String description, String title) {
        SelectionIntroduction selectionIntroduction = this.selectionIntroductionRepository.findById(selectionIntroductionId)
                .orElseThrow(() -> new ResourceNotFoundException("No selection introduction found"));
        selectionIntroduction.setTitle(title);
        selectionIntroduction.setDescription(description);
        selectionIntroduction.setImageLink(imageLink);
        selectionIntroductionRepository.save(selectionIntroduction);
        return selectionIntroduction.getSelection().getChoice().getId();
    }
}
