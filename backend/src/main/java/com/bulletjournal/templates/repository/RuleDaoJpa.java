package com.bulletjournal.templates.repository;


import com.bulletjournal.templates.repository.model.Category;
import com.bulletjournal.templates.repository.model.CategoryRule;
import com.bulletjournal.templates.repository.model.Step;
import com.bulletjournal.templates.repository.model.StepRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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
    public CategoryRule createCategoryRule(Long categoryId, String name, Integer priority, String ruleExpression) {
        Category category = categoryDaoJpa.getById(categoryId);
        CategoryRule categoryRule = new CategoryRule();
        categoryRule.setName(name);
        categoryRule.setPriority(priority);
        categoryRule.setRuleExpression(ruleExpression);
        categoryRule.setCategory(category);
        return categoryRuleRepository.save(categoryRule);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public StepRule createStepRule(Long stepId, String name, Integer priority, String ruleExpression) {
        Step step = stepDaoJpa.getById(stepId);
        StepRule stepRule = new StepRule();
        stepRule.setName(name);
        stepRule.setPriority(priority);
        stepRule.setRuleExpression(ruleExpression);
        stepRule.setStep(step);
        return stepRuleRepository.save(stepRule);
    }
}
