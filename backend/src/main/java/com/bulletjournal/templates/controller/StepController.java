package com.bulletjournal.templates.controller;

import com.bulletjournal.templates.repository.CategoryDaoJpa;
import com.bulletjournal.templates.repository.StepDaoJpa;
import com.bulletjournal.templates.workflow.models.Step;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class StepController {

    public static final Logger LOGGER = LoggerFactory.getLogger(StepController.class);

    public static final String STEPS_ROUTE = "/api/steps";

    private CategoryDaoJpa categoryDaoJpa;

    private StepDaoJpa stepDaoJpa;

    @Autowired
    public StepController(
        CategoryDaoJpa categoryDaoJpa,
        StepDaoJpa stepDaoJpa
    ) {
        this.categoryDaoJpa = categoryDaoJpa;
        this.stepDaoJpa = stepDaoJpa;
    }

    @GetMapping(STEPS_ROUTE)
    public List<Step> getAllSteps() {
        // get all categories with choices
        // get all steps
        // convert them to workflow.Step
        return new ArrayList<>();
    }
}