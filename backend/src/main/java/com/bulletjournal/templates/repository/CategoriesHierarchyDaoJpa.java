package com.bulletjournal.templates.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CategoriesHierarchyDaoJpa {

    private static Logger LOGGER = LoggerFactory.getLogger(CategoriesHierarchyDaoJpa.class);

    private CategoriesHierarchyRepository repository;

    @Autowired
    public CategoriesHierarchyDaoJpa(CategoriesHierarchyRepository repository) {
        this.repository = repository;
    }


}
