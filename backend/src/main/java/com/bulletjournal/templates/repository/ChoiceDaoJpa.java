package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Choice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Choice save(String name, boolean multiple, boolean instructionIncluded) {
        Choice choice = new Choice(name, multiple, instructionIncluded);
        return choiceRepository.save(choice);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteById(Long id) {
        if (!this.choiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Choice with id: " + id + " doesn't exist, cannot delete.");
        }
        choiceRepository.deleteById(id);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void save(Choice choice) {
        choiceRepository.save(choice);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.templates.controller.model.Choice getChoiceByIdWithCategoriesSelectionsSteps(Long choiceId) {
        Choice choice = getById(choiceId);
        com.bulletjournal.templates.controller.model.Choice presentChoice = choice.toPresentationModel();
        List<com.bulletjournal.templates.controller.model.Category> presentCategories = choice.getCategories().stream().map(
                category -> new com.bulletjournal.templates.controller.model.Category(
                        category.getId(), category.getName(), category.getDescription(), category.getIcon(), category.getColor(),
                        category.getForumId(), category.getImage())).collect(Collectors.toList());
        presentChoice.setCategories(presentCategories);
        List<com.bulletjournal.templates.controller.model.Step> presentSteps = choice.getSteps().stream().map(
                step -> new com.bulletjournal.templates.controller.model.Step(
                        step.getId(), step.getName())).collect(Collectors.toList());
        presentChoice.setSteps(presentSteps);
        return presentChoice;
    }
}
