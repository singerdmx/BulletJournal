package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.Selection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Repository
public class SelectionDaoJpa {
    private SelectionRepository selectionRepository;
    private ChoiceRepository choiceRepository;

    @Autowired
    SelectionDaoJpa(SelectionRepository selectionRepository,
                    ChoiceRepository choiceRepository) {
        this.selectionRepository = selectionRepository;
        this.choiceRepository = choiceRepository;
    }

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
    public List<Selection> getSelectionsById(List<Long> ids) {
        if (ids.isEmpty()) {
            return Collections.emptyList();
        }
        return selectionRepository.findAllById(ids);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteById(Long id) {
        if (!this.selectionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Selection with id: " + id + " doesn't exist, cannot delete.");
        }
        selectionRepository.deleteById(id);
    }


}
