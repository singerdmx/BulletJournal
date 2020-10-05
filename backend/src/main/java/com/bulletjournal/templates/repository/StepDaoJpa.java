package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.controller.model.UpdateStepParams;
import com.bulletjournal.templates.repository.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class StepDaoJpa {

    private final StepRepository stepRepository;

    private final ChoiceDaoJpa choiceDaoJpa;

    private final SelectionDaoJpa selectionDaoJpa;

    private final RuleDaoJpa ruleDaoJpa;

    @Autowired
    public StepDaoJpa(
        StepRepository stepRepository, ChoiceDaoJpa choiceDaoJpa, SelectionDaoJpa selectionDaoJpa, @Lazy RuleDaoJpa ruleDaoJpa
    ) {
        this.stepRepository = stepRepository;
        this.choiceDaoJpa = choiceDaoJpa;
        this.selectionDaoJpa = selectionDaoJpa;
        this.ruleDaoJpa = ruleDaoJpa;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Step> findAll() {
        return stepRepository.findAll();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void save(Step step) {
        stepRepository.save(step);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteById(Long stepId) {
        stepRepository.deleteById(stepId);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Step getById(Long stepId) {
        Step step = stepRepository.getById(stepId);
        if (step == null) {
            throw new ResourceNotFoundException("Step with id " + stepId + " doesn't exist");
        }
        sortChoicesForStep(step);
        return step;
    }

    private void sortChoicesForStep(Step step) {
        if (step.getChoiceOrder() == null || step.getChoices() == null) {
            return;
        }
        List<Long> choiceIdOrder = step.getChoiceOrderById();
        step.getChoices().sort(Comparator.comparingInt(a -> choiceIdOrder.indexOf(a.getId())));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateChoicesForStep(Long stepId, List<Long> choicesIds) {
        Step step = this.getById(stepId);
        List<Choice> choices = choiceDaoJpa.getChoicesById(choicesIds);
        step.setChoices(choices);
        step.setChoiceOrder(choicesIds);
        this.save(step);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Step create(String name, Long nextStepId) {
        Step step = new Step(name);
        Step nextStep = null;
        if (nextStepId != null) {
            nextStep = getById(nextStepId);
        }
        step.setNextStep(nextStep);
        return stepRepository.save(step);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateExcludedSelectionsForStep(List<Long> excludedSelectionIds, Long stepId) {
        Step step = this.getById(stepId);
        step.setExcludedSelections(selectionDaoJpa.getSelectionsById(
                excludedSelectionIds).stream().map(
                com.bulletjournal.templates.repository.model.Selection::getId).collect(Collectors.toList()));
        this.save(step);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateStep(Long stepId, UpdateStepParams updateStepParams) {
        Step step = getById(stepId);
        step.setName(updateStepParams.getName());
        Step nextStep = null;
        if (updateStepParams.getNextStepId() != null) {
            nextStep = getById(updateStepParams.getNextStepId());
        }
        step.setNextStep(nextStep);
        save(step);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Step clone(Long stepId) {
        Step step = getById(stepId);
        Step newStep = new Step();
        newStep.clone(step);
        stepRepository.save(newStep);
        if (step.getStepRules() != null) {
            List<StepRule> stepRules = new ArrayList<>();
            step.getStepRules().forEach(stepRule -> {
                StepRule rule = new StepRule();
                rule.clone(stepRule);
                rule.setStep(newStep);
                stepRules.add(rule);
            });
            ruleDaoJpa.saveStepRules(stepRules);
        }
        return newStep;
    }
}
