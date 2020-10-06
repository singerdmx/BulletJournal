package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.controller.model.UpdateStepParams;
import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.SampleTaskRule;
import com.bulletjournal.templates.repository.model.Step;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class StepDaoJpa {

    private final StepRepository stepRepository;

    private final ChoiceDaoJpa choiceDaoJpa;

    private final SelectionDaoJpa selectionDaoJpa;

    private final RuleDaoJpa ruleDaoJpa;

    private final SampleTaskRuleDaoJpa sampleTaskRuleDaoJpa;

    @Autowired
    public StepDaoJpa(
            StepRepository stepRepository, ChoiceDaoJpa choiceDaoJpa, SelectionDaoJpa selectionDaoJpa, @Lazy RuleDaoJpa ruleDaoJpa,
            @Lazy SampleTaskRuleDaoJpa sampleTaskRuleDaoJpa
    ) {
        this.stepRepository = stepRepository;
        this.choiceDaoJpa = choiceDaoJpa;
        this.selectionDaoJpa = selectionDaoJpa;
        this.ruleDaoJpa = ruleDaoJpa;
        this.sampleTaskRuleDaoJpa = sampleTaskRuleDaoJpa;
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
        Step savedStep = stepRepository.save(newStep);
        ruleDaoJpa.saveStepRules(newStep.getStepRules());
        for (SampleTaskRule sampleTaskRule : newStep.getSampleTaskRules()) {
            sampleTaskRuleDaoJpa.upsert(savedStep.getId(), sampleTaskRule.getSelectionCombo(), sampleTaskRule.getTaskIds());
        }
        return savedStep;
    }
}
