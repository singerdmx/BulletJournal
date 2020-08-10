package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.CategoriesHierarchy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class CategoriesHierarchyDaoJpa {

    private static Logger LOGGER = LoggerFactory.getLogger(CategoriesHierarchyDaoJpa.class);

    private CategoriesHierarchyRepository hierarchyRepository;

    @Autowired
    public CategoriesHierarchyDaoJpa(CategoriesHierarchyRepository repository) {
        this.hierarchyRepository = repository;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CategoriesHierarchy updateHierarchy(String newHierarchy) {
        CategoriesHierarchy hierarchy = hierarchyRepository.getCategoriesHierarchy();
        if (hierarchy == null) {
            throw new ResourceNotFoundException("Category Hierarchy not found in DB");
        }
        hierarchy.setHierarchy(newHierarchy);
        hierarchyRepository.save(hierarchy);
        return hierarchy;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CategoriesHierarchy getHierarchies() {
        CategoriesHierarchy hierarchy = hierarchyRepository.getCategoriesHierarchy();
        if (hierarchy == null) {
            throw new ResourceNotFoundException("Category Hierarchy not found in DB");
        }
        return hierarchy;
    }
}
