package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.controller.model.CategorySteps;
import com.bulletjournal.templates.controller.model.Rule;
import com.bulletjournal.templates.controller.model.SampleTaskRuleView;
import com.bulletjournal.templates.repository.model.*;
import com.bulletjournal.util.StringUtil;
import org.apache.commons.lang3.tuple.Triple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class CategoryDaoJpa {

    private static Logger LOGGER = LoggerFactory.getLogger(CategoryDaoJpa.class);

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private SampleTaskRuleRepository sampleTaskRuleRepository;
    @Autowired
    private ChoiceDaoJpa choiceDaoJpa;
    @Autowired
    private StepDaoJpa stepDaoJpa;
    @Autowired
    private SelectionDaoJpa selectionDaoJpa;
    @Lazy
    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;
    @Lazy
    @Autowired
    private RuleDaoJpa ruleDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Category create(String name, String description, String icon, String color, Long forumId, String image, Long nextStepId, Boolean needStartDate) {
        if (categoryRepository.getByName(name) != null) {
            throw new ResourceAlreadyExistException("Category with name " + name + " already exists.");
        }
        Step step = null;
        if (nextStepId != null) {
            step = stepDaoJpa.getById(nextStepId);
        }
        Category category = new Category(name, description, icon, color, forumId, image, step, needStartDate);
        return categoryRepository.save(category);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Category getByName(String name) {
        Category category = categoryRepository.getByName(name);
        if (category == null) {
            throw new ResourceNotFoundException("Category with name " + name + " doesn't exist.");
        }
        return category;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Category getById(Long id) {
        Category category = categoryRepository.getById(id);
        if (category == null) {
            throw new ResourceNotFoundException("Category with id " + id + " doesn't exist");
        }
        sortChoicesForCategory(category);
        return category;
    }

    private void sortChoicesForCategory(Category category) {
        if (category.getChoiceOrder() == null || category.getChoices() == null) {
            return;
        }
        List<Long> choiceIdOrder = category.getChoiceOrderById();
        category.getChoices().sort(Comparator.comparingInt(a -> choiceIdOrder.indexOf(a.getId())));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        categories.forEach(this::sortChoicesForCategory);
        return categories;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteById(Long id) {
        if (!this.categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category with id: " + id + " doesn't exist, cannot delete.");
        }
        categoryRepository.deleteById(id);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void save(Category category) {
        categoryRepository.save(category);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateChoicesForCategory(Long categoryId, List<Long> choicesIds) {
        Category category = this.getById(categoryId);
        List<Choice> choices = choiceDaoJpa.getChoicesById(choicesIds);
        category.setChoices(choices);
        category.setChoiceOrder(choicesIds);
        this.save(category);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateCategory(Long categoryId, String name, String icon, String color, Long forumId, String description, String image, Long nextStepId, Boolean needStartDate) {
        Category category = getById(categoryId);
        category.setName(name);
        category.setIcon(icon);
        category.setColor(color);
        category.setForumId(forumId);
        category.setDescription(description);
        category.setImage(image);
        category.setNeedStartDate(needStartDate);
        if (nextStepId == null) {
            category.setNextStep(null);
        } else if (nextStepId > 0) {
            // negative means no change
            Step step = stepDaoJpa.getById(nextStepId);
            category.setNextStep(step);
        }
        save(category);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CategorySteps getCategorySteps(Long categoryId) {
        CategorySteps categorySteps = new CategorySteps();
        List<Triple<com.bulletjournal.templates.controller.model.Step, Rule, com.bulletjournal.templates.controller.model.Step>> connections = new ArrayList<>();
        List<Long> allStepIds = new ArrayList<>();
        List<SampleTaskRuleView> finalSteps = new ArrayList<>();
        allStepIds.add(categoryId);

        Category category = categoryRepository.getById(categoryId);
        List<CategoryRule> categoryRules = category.getCategoryRules();
        Queue<Step> bfsQueue = categoryRules.stream().map(categoryRule -> {
            Step nextStep = categoryRule.getConnectedStep();
            connections.add(Triple.of(category.toPresentationModel().convertToStep(),
                    categoryRule.toPresentationModel(), nextStep.toPresentationModel()));
            allStepIds.add(nextStep.getId());

            return nextStep;
        }).collect(Collectors.toCollection(LinkedList::new));
        int size = bfsQueue.size();
        Set<Long> allTasks = new HashSet<>();
        Set<Long> allSelections = new HashSet<>();
        while (size > 0) {
            for (int i = 0; i < size; i++) {
                Step currentStep = bfsQueue.poll();
                if (currentStep == null) {
                    continue;
                }

                List<StepRule> stepRules = currentStep.getStepRules();
                if (stepRules != null && !stepRules.isEmpty()) {
                    stepRules.forEach(stepRule -> {
                        Step nextStep = ruleDaoJpa.getStepRuleById(stepRule.getId()).getConnectedStep();

                        if (nextStep != null) {
                            connections.add(Triple.of(currentStep.toPresentationModel(), stepRule.toPresentationModel(), nextStep.toPresentationModel()));

                            bfsQueue.add(nextStep);
                            allStepIds.add(nextStep.getId());
                        } else {
                            findSelectionComboAndSampleTaskForFinalStep(finalSteps, currentStep, allTasks, allSelections);
                        }
                    });
                } else {
                    Step nextStep = currentStep.getNextStep();
                    if (nextStep != null) {
                        connections.add(Triple.of(currentStep.toPresentationModel(), null, nextStep.toPresentationModel()));

                        bfsQueue.add(nextStep);
                        allStepIds.add(nextStep.getId());
                    } else {
                        findSelectionComboAndSampleTaskForFinalStep(finalSteps, currentStep, allTasks, allSelections);
                    }
                }

                size = bfsQueue.size();
            }
        }

        categorySteps.setConnections(connections);
        categorySteps.setStepIds(allStepIds);

        Map<Long, SampleTask> taskMap = this.sampleTaskDaoJpa.findAllById(allTasks)
                .stream().collect(Collectors.toMap(SampleTask::getId, t -> t));

        Map<Long, Selection> selectionMap = this.selectionDaoJpa.getSelectionsById(allSelections)
                .stream().collect(Collectors.toMap(Selection::getId, s -> s));

        finalSteps.forEach(finalStep -> {
            for (long selectionId: StringUtil.convertNumArray(finalStep.getSelectionCombo())) {
                if (selectionMap.containsKey(selectionId)) {
                    finalStep.addSelection(selectionMap.get(selectionId).toPresentationModel());
                }
            }

            for (long taskId: StringUtil.convertNumArray(finalStep.getTaskIds())) {
                SampleTask sampleTask = taskMap.get(taskId);
                if (sampleTask != null) {
                    finalStep.addTask(new com.bulletjournal.templates.controller.model.SampleTask(
                            sampleTask.getId(),
                            sampleTask.getName()
                    ));
                }
            }
            finalStep.setTaskIds("");
        });

        categorySteps.setFinalSteps(finalSteps);

        return categorySteps;
    }

    private void findSelectionComboAndSampleTaskForFinalStep(
            List<SampleTaskRuleView> finalSteps,
            Step currentStep, Set<Long> allTasks, Set<Long> allSelections) {
        // get task rules
        List<SampleTaskRule> rules = this.sampleTaskRuleRepository
                .findAllByStep(currentStep);
        finalSteps.addAll(rules.stream().map(r -> new SampleTaskRuleView(r.toPresentationModel()))
                .collect(Collectors.toList()));
        rules.forEach(rule -> {
            allTasks.addAll(rule.getSampleTaskIds());
            allSelections.addAll(rule.getSelectionIds());
        });
    }
}
