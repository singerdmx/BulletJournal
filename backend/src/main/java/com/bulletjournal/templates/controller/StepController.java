package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.StepDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class StepController {

    public static final Logger LOGGER = LoggerFactory.getLogger(StepController.class);

    public static final String STEPS_ROUTE = "/api/steps";

    public static final String STEP_ROUTE = "/api/steps/{stepId}";

    public static final String PUBLIC_STEP_ROUTE = "/api/public/steps/{stepId}";

    public static final String STEP_CLONE_ROUTE = "/api/steps/{stepId}/clone";

    protected static final String STEP_SET_CHOICES_ROUTE = "/api/steps/{stepId}/setChoices";

    protected static final String STEP_SET_EXCLUDED_SELECTIONS_ROUTE = "api/steps/{stepId}/setExcludedSelections";

    private final StepDaoJpa stepDaoJpa;

    private final UserDaoJpa userDaoJpa;

    @Autowired
    public StepController(
        StepDaoJpa stepDaoJpa,
        UserDaoJpa userDaoJpa
    ) {
        this.stepDaoJpa = stepDaoJpa;
        this.userDaoJpa = userDaoJpa;
    }

    @GetMapping(STEPS_ROUTE)
    public Steps getAllSteps() {
        List<Step> steps
            = stepDaoJpa.findAll().stream()
                .map(step -> step.toPresentationModel())
                .collect(Collectors.toList());
        return new Steps(steps, null);
    }

    @PostMapping(STEPS_ROUTE)
    public Step createStep(@Valid @RequestBody CreateStepParams params) {
        validateRequester();
        return this.stepDaoJpa.create(params.getName(), params.getNextStepId()).toPresentationModel();
    }

    @GetMapping(PUBLIC_STEP_ROUTE)
    public Step getStep(@NotNull @PathVariable Long stepId) {
        return stepDaoJpa.getById(stepId).toPresentationModel();
    }

    @PutMapping(STEP_SET_CHOICES_ROUTE)
    public Step updateChoicesForStep(
            @NotNull @PathVariable Long stepId,
            @NotNull @RequestBody List<Long> choicesIds) {
        validateRequester();
        stepDaoJpa.updateChoicesForStep(stepId, choicesIds);
        return getStep(stepId);
    }

    @PutMapping(STEP_SET_EXCLUDED_SELECTIONS_ROUTE)
    public Step setExcludedSelections(@PathVariable Long stepId, @NotNull @RequestBody List<Long> excludedSelectionIds) {
        validateRequester();
        stepDaoJpa.updateExcludedSelectionsForStep(excludedSelectionIds, stepId);
        return getStep(stepId);
    }

    @DeleteMapping(STEP_ROUTE)
    public void deleteStep(@NotNull @PathVariable Long stepId) {
        validateRequester();
        stepDaoJpa.deleteById(stepId);
    }

    @PutMapping(STEP_ROUTE)
    public Step updateStep(@NotNull @PathVariable Long stepId,
                                   @Valid @RequestBody UpdateStepParams updateStepParams) {
        validateRequester();
        stepDaoJpa.updateStep(stepId, updateStepParams);
        return getStep(stepId);
    }

    @PostMapping(STEP_CLONE_ROUTE)
    public Step cloneStep(@NotNull @PathVariable Long stepId) {
        validateRequester();
        return stepDaoJpa.clone(stepId).toPresentationModel();
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}