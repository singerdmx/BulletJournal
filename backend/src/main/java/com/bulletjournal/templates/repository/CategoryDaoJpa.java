package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class CategoryDaoJpa {

    private static Logger LOGGER = LoggerFactory.getLogger(CategoryDaoJpa.class);

    CategoryRepository categoryRepository;

    @Autowired
    public CategoryDaoJpa(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Category create(String name, String description) {
        if (categoryRepository.getByName(name) != null) {
            throw new ResourceAlreadyExistException("Category with name " + name + " already exists.");
        }
        Category category = new Category(name, description);
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
            throw new ResourceNotFoundException("Category with id " + id + "doesn't exist");
        }
        return category;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
