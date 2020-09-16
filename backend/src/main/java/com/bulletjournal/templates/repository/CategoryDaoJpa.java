package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Category;
import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.Step;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Repository
public class CategoryDaoJpa {

    private static Logger LOGGER = LoggerFactory.getLogger(CategoryDaoJpa.class);

    private CategoryRepository categoryRepository;
    private ChoiceDaoJpa choiceDaoJpa;
    private StepDaoJpa stepDaoJpa;

    @Autowired
    public CategoryDaoJpa(CategoryRepository categoryRepository, ChoiceDaoJpa choiceDaoJpa, StepDaoJpa stepDaoJpa) {
        this.choiceDaoJpa = choiceDaoJpa;
        this.categoryRepository = categoryRepository;
        this.stepDaoJpa = stepDaoJpa;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Category create(String name, String description, String icon, String color, Long forumId, String image, Long nextStepId) {
        if (categoryRepository.getByName(name) != null) {
            throw new ResourceAlreadyExistException("Category with name " + name + " already exists.");
        }
        Step step = null;
        if (nextStepId != null) {
            step = stepDaoJpa.getById(nextStepId);
        }
        Category category = new Category(name, description, icon, color, forumId, image, step);
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
    public void updateCategory(Long categoryId, String name, String icon, String color, Long forumId, String description, String image, Long nextStepId) {
        Category category = getById(categoryId);
        category.setName(name);
        category.setIcon(icon);
        category.setColor(color);
        category.setForumId(forumId);
        category.setDescription(description);
        category.setImage(image);
        if (nextStepId == null) {
            category.setNextStep(null);
        } else if (nextStepId > 0) {
            // negative means no change
            Step step = stepDaoJpa.getById(nextStepId);
            category.setNextStep(step);
        }
        save(category);
    }
}
