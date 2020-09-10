package com.bulletjournal.templates.repository;


import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Category;
import com.bulletjournal.templates.repository.model.CategoryRule;
import com.bulletjournal.templates.repository.model.Step;
import com.bulletjournal.templates.repository.model.StepRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class RuleDaoJpa {

    @Autowired
    private CategoryRuleRepository categoryRuleRepository;

    @Autowired
    private StepRuleRepository stepRuleRepository;

    @Autowired
    private CategoryDaoJpa categoryDaoJpa;

    @Autowired
    private StepDaoJpa stepDaoJpa;


    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CategoryRule createCategoryRule(Long categoryId, String name, Integer priority, String ruleExpression, Long connectedStepId) {
        Category category = categoryDaoJpa.getById(categoryId);
        Step connectedStep = stepDaoJpa.getById(connectedStepId);
        CategoryRule categoryRule = new CategoryRule();
        categoryRule.setName(name);
        categoryRule.setPriority(priority);
        categoryRule.setRuleExpression(ruleExpression);
        categoryRule.setCategory(category);
        categoryRule.setConnectedStep(connectedStep);
        return categoryRuleRepository.save(categoryRule);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public StepRule createStepRule(Long stepId, String name, Integer priority, String ruleExpression, Long connectedStepId) {
        Step step = stepDaoJpa.getById(stepId);
        Step connectedStep = stepDaoJpa.getById(connectedStepId);
        StepRule stepRule = new StepRule();
        stepRule.setName(name);
        stepRule.setPriority(priority);
        stepRule.setRuleExpression(ruleExpression);
        stepRule.setStep(step);
        stepRule.setConnectedStep(connectedStep);
        return stepRuleRepository.save(stepRule);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CategoryRule getCategoryRuleById(Long ruleId) {
        CategoryRule categoryRule = categoryRuleRepository.getById(ruleId);
        if (categoryRule == null) {
            throw new ResourceNotFoundException("categoryRule id " + ruleId + " not found");
        }
        return categoryRule;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public StepRule getStepRuleById(Long ruleId) {
        StepRule stepRule = stepRuleRepository.getById(ruleId);
        if (stepRule == null) {
            throw new ResourceNotFoundException("stepRule id " + ruleId + " not found");
        }
        return stepRule;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteCategoryRuleById(Long ruleId) {
        if (!categoryRuleRepository.existsById(ruleId)) {
            throw new ResourceNotFoundException("categoryRule id " + ruleId + " not exit");
        }
        categoryRuleRepository.deleteById(ruleId);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteStepRuleById(Long ruleId) {
        if (!stepRuleRepository.existsById(ruleId)) {
            throw new ResourceNotFoundException("stepRule id " + ruleId + " not exit");
        }
        stepRuleRepository.deleteById(ruleId);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CategoryRule updateCategoryRule(Long ruleId, Long categoryId, String name, Integer priority, String ruleExpression, Long connectedStepId) {
        CategoryRule categoryRule = getCategoryRuleById(ruleId);
        Category category = categoryDaoJpa.getById(categoryId);
        Step connectedStep = stepDaoJpa.getById(connectedStepId);
        categoryRule.setCategory(category);
        categoryRule.setName(name);
        categoryRule.setPriority(priority);
        categoryRule.setRuleExpression(ruleExpression);
        categoryRule.setConnectedStep(connectedStep);
        return categoryRuleRepository.save(categoryRule);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public StepRule updateStepRule(Long ruleId, Long stepId, String name, Integer priority, String ruleExpression, Long connectedStepId) {
        StepRule stepRule = getStepRuleById(ruleId);
        Step step = stepDaoJpa.getById(stepId);
        Step connectedStep = stepDaoJpa.getById(connectedStepId);
        stepRule.setStep(step);
        stepRule.setName(name);
        stepRule.setPriority(priority);
        stepRule.setRuleExpression(ruleExpression);
        stepRule.setConnectedStep(connectedStep);
        return stepRuleRepository.save(stepRule);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void saveStepRules(List<StepRule> stepRules) {
        stepRuleRepository.saveAll(stepRules);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<CategoryRule> getAllCategoryRules() {
        return categoryRuleRepository.findAll();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<StepRule> getAllStepRules() {
        return stepRuleRepository.findAll();
    }
}
