package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.CategoryDaoJpa;
import com.bulletjournal.templates.repository.RuleDaoJpa;
import com.bulletjournal.templates.repository.SampleTaskDaoJpa;
import com.bulletjournal.templates.repository.StepDaoJpa;
import com.bulletjournal.templates.repository.model.Category;
import com.bulletjournal.templates.repository.model.CategoryRule;
import com.bulletjournal.templates.repository.model.Step;
import com.bulletjournal.templates.repository.model.StepRule;
import com.bulletjournal.templates.workflow.models.RuleExpression;
import com.google.gson.Gson;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class WorkflowController {

    public static final String NEXT_STEP_ROUTE = "/api/public/steps/{stepId}/next";
    public static final String SAMPLE_TASKS_ROUTE = "/api/sampleTasks";
    public static final String SAMPLE_TASK_ROUTE = "/api/sampleTasks/{sampleTaskId}";
    public static final String SAMPLE_TASK_BY_METADATA = "/api/sampleTasks/filter";

    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private RuleDaoJpa ruleDaoJpa;

    @Autowired
    private CategoryDaoJpa categoryDaoJpa;

    @Autowired
    private StepDaoJpa stepDaoJpa;

    private static final Gson GSON = new Gson();

    @GetMapping(NEXT_STEP_ROUTE)
    public NextStep getNext(
            @NotNull @PathVariable Long stepId,
            @NotNull @RequestParam List<Long> selections,
            @NotNull @RequestParam(required = false, defaultValue = "false") boolean first
    ) {
        if (first) {
            return checkIfSelectionsMatchCategoryRules(stepId, selections);
        } else {
            return checkIfSelectionsMatchStepRules(stepId, selections);
        }
    }

    private NextStep checkIfSelectionsMatchCategoryRules(Long stepId, List<Long> selections) {
        Category category = categoryDaoJpa.getById(stepId);
        List<CategoryRule> categoryRules = category.getCategoryRules();
        categoryRules.sort((rule1, rule2) -> rule2.getPriority() - rule1.getPriority());
        NextStep nextStep = new NextStep();
        for (CategoryRule categoryRule : categoryRules) {
            RuleExpression ruleExpression = GSON.fromJson(categoryRule.getRuleExpression(), RuleExpression.class);
            if (ruleMatch(ruleExpression, selections)) {
                if (categoryRule.getConnectedStep() != null) {
                    nextStep.setStep(categoryRule.getConnectedStep().toPresentationModel());
                }
                return nextStep;
            }
        }
        if (category.getNextStep() != null) {
            nextStep.setStep(category.getNextStep().toPresentationModel());
        }
        return nextStep;
    }

    private NextStep checkIfSelectionsMatchStepRules(Long stepId, List<Long> selections) {
        Step step = stepDaoJpa.getById(stepId);
        List<StepRule> stepRules = step.getStepRules();
        stepRules.sort((rule1, rule2) -> rule2.getPriority() - rule1.getPriority());
        NextStep nextStep = new NextStep();
        for (StepRule stepRule : stepRules) {
            RuleExpression ruleExpression = GSON.fromJson(stepRule.getRuleExpression(), RuleExpression.class);
            if (ruleMatch(ruleExpression, selections)) {
                if (stepRule.getConnectedStep() != null) {
                    nextStep.setStep(stepRule.getConnectedStep().toPresentationModel());
                }
                return nextStep;
            }
        }
        if (step.getNextStep() != null) {
            nextStep.setStep(step.getNextStep().toPresentationModel());
        }
        return nextStep;
    }

    private boolean ruleMatch(RuleExpression ruleExpression, List<Long> selections) {
        switch (ruleExpression.getLogicOperator()) {
            case OR:
                for (RuleExpression.Criteria criteria : ruleExpression.getCriteriaList()) {
                    switch (criteria.getCondition()) {
                        case EXACT:
                            if (criteria.getSelectionIds().containsAll(selections) && selections.containsAll(criteria.getSelectionIds())) {
                                return true;
                            }
                            break;
                        case CONTAINS:
                            if (selections.containsAll(criteria.getSelectionIds())) {
                                return true;
                            }
                            break;
                        case NOT_CONTAIN:
                            if (Collections.disjoint(criteria.getSelectionIds(), selections)) {
                                return true;
                            }
                            break;
                        case IGNORE:
                            break;
                    }
                }
                return false;
            case AND:
                for (RuleExpression.Criteria criteria : ruleExpression.getCriteriaList()) {
                    switch (criteria.getCondition()) {
                        case EXACT:
                            if (!(criteria.getSelectionIds().containsAll(selections) && selections.containsAll(criteria.getSelectionIds()))) {
                                return false;
                            }
                            break;
                        case CONTAINS:
                            if (!selections.containsAll(criteria.getSelectionIds())) {
                                return false;
                            }
                            break;
                        case NOT_CONTAIN:
                            if (!Collections.disjoint(criteria.getSelectionIds(), selections)) {
                                return false;
                            }
                            break;
                        case IGNORE:
                            break;
                    }
                }
                return true;
        }
        return false;
    }

    @PostMapping(SAMPLE_TASKS_ROUTE)
    public SampleTask createSampleTask(@Valid @RequestBody CreateSampleTaskParams createSampleTaskParams) {
        validateRequester();
        return sampleTaskDaoJpa.createSampleTask(createSampleTaskParams).toPresentationModel();
    }

    @GetMapping(SAMPLE_TASK_ROUTE)
    public SampleTask getSampleTask(@NotNull @PathVariable Long sampleTaskId) {
        validateRequester();
        return sampleTaskDaoJpa.findSampleTaskById(sampleTaskId).toPresentationModel();
    }

    @GetMapping(SAMPLE_TASK_BY_METADATA)
    public List<SampleTask> getSampleTasksByFilter(@RequestParam(value = "metadata", required = false) String metadataFilter) {
        validateRequester();
        return sampleTaskDaoJpa.findSampleTasksByMetadataFilter(metadataFilter).stream()
                .map(com.bulletjournal.templates.repository.model.SampleTask::toPresentationModel)
                .collect(Collectors.toList());
    }

    @PutMapping(SAMPLE_TASK_ROUTE)
    public SampleTask updateSampleTask(@NotNull @PathVariable Long sampleTaskId, @Valid @RequestBody UpdateSampleTaskParams updateSampleTaskParams) {
        validateRequester();
        return sampleTaskDaoJpa.updateSampleTask(sampleTaskId, updateSampleTaskParams).toPresentationModel();
    }

    @DeleteMapping(SAMPLE_TASK_ROUTE)
    public void deleteSampleTask(@NotNull @PathVariable Long sampleTaskId) {
        validateRequester();
        sampleTaskDaoJpa.deleteSampleTaskById(sampleTaskId);
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
