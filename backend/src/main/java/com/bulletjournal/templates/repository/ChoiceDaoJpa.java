package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Choice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Repository
public class ChoiceDaoJpa {
    @Autowired
    private ChoiceRepository choiceRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Choice getById(Long id) {
        Choice choice = choiceRepository.getById(id);
        if (choice == null) {
            throw new ResourceNotFoundException("Choice with id " + id + " doesn't exist");
        }
        return choice;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Choice> getChoicesById(List<Long> ids) {
        if (ids.isEmpty()) {
            return Collections.emptyList();
        }
        List<Choice> choices = choiceRepository.findAllById(ids);
        return choices;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Choice> getAllChoices() {
        return choiceRepository.findAll();
    }
}
