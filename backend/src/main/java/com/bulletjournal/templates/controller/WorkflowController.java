package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.SampleTask;
import com.bulletjournal.templates.controller.model.SampleTaskRule;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.redis.RedisSampleTasksRepository;
import com.bulletjournal.templates.repository.*;
import com.bulletjournal.templates.repository.model.Category;
import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.Step;
import com.bulletjournal.templates.repository.model.*;
import com.bulletjournal.templates.workflow.engine.RuleEngine;
import com.bulletjournal.templates.workflow.models.RuleExpression;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class WorkflowController {

    public static final String NEXT_STEP_ROUTE = "/api/public/steps/{stepId}/next";
    public static final String PUBLIC_SAMPLE_TASKS_ROUTE = "/api/public/sampleTasks";
    public static final String SAMPLE_TASKS_IMPORT_ROUTE = "/api/sampleTasks/import";
    public static final String SAMPLE_TASKS_ROUTE = "/api/sampleTasks";
    public static final String SAMPLE_TASK_ROUTE = "/api/sampleTasks/{sampleTaskId}";
    public static final String SAMPLE_TASK_BY_METADATA = "/api/sampleTasks";
    public static final String SAMPLE_TASK_RULE_ROUTE = "/api/sampleTaskRule";
    public static final String SAMPLE_TASKS_RULE_ROUTE = "/api/sampleTaskRules";
    public static final String CATEGORY_STEPS_ROUTE = "/api/categories/{categoryId}/steps";
    public static final String SUBSCRIBED_CATEGORIES_ROUTE = "/api/subscribedCategories";
    public static final String AUDIT_SAMPLE_TASK_ROUTE = "/api/sampleTasks/{sampleTaskId}/audit";

    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;

    @Autowired
    private SampleTaskRuleDaoJpa sampleTaskRuleDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private CategoryDaoJpa categoryDaoJpa;

    @Autowired
    private StepDaoJpa stepDaoJpa;

    @Autowired
    private RedisSampleTasksRepository sampleTasksRedisCache;

    @Autowired
    private RuleEngine ruleEngine;

    @Autowired
    private UserCategoryDaoJpa userCategoryDaoJpa;

    private static final Gson GSON = new Gson();

    @GetMapping(SUBSCRIBED_CATEGORIES_ROUTE)
    public List<SubscribedCategory> getUserSubscribedCategories() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);
        List<UserCategory> userCategoryList = userCategoryDaoJpa.getUserCategoriesByUserName(requester);
        Map<Category, SubscribedCategory> map = new HashMap<>();
        userCategoryList.forEach(uc -> {
            if (!map.containsKey(uc.getCategory())) {
                map.put(uc.getCategory(), new SubscribedCategory());
            }
            SubscribedCategory sc = map.get(uc.getCategory());
            sc.addProject(uc.getProject().toPresentationModel());
            sc.addSelection(uc.getMetadataKeyword().getSelection().toPresentationModel());
            sc.setCategory(uc.getCategory().toSimplePresentationModel());
        });
        return new ArrayList<>(map.values());
    }

    @GetMapping(NEXT_STEP_ROUTE)
    public NextStep getNext(
            @NotNull @PathVariable Long stepId,
            @NotNull @RequestParam List<Long> selections,
            @NotNull @RequestParam(required = false) List<Long> prevSelections,
            @NotNull @RequestParam(required = false, defaultValue = "false") boolean first
    ) {
        NextStep nextStep;
        if (first) {
            nextStep = checkIfSelectionsMatchCategoryRules(stepId, selections);
        } else {
            nextStep = checkIfSelectionsMatchStepRules(stepId, selections);
            if (nextStep.getStep() != null && nextStep.getStep().getChoices().isEmpty()) {
                // assume final step, try to get sample tasks using prevSelections
                List<SampleTask> sampleTasks = sampleTaskDaoJpa.findAllById(
                        this.ruleEngine.getSampleTasksForFinalStep(
                                nextStep.getStep().getId(), selections, prevSelections))
                        .stream().map(e -> e.toPresentationModel()).collect(Collectors.toList());
                // store in redis and generate scrollId
                // setSampleTasks with the first 10 tasks
                if (sampleTasks.size() <= 10) {
                    nextStep.setScrollId("");
                    nextStep.setSampleTasks(sampleTasks);
                    return nextStep;
                }
                String scrollId = UUID.randomUUID().toString();
                nextStep.setScrollId(scrollId);
                nextStep.setSampleTasks(sampleTasks.subList(0, 10));
                sampleTasksRedisCache.save(new SampleTasks(scrollId, sampleTasks.subList(10, sampleTasks.size())));
            }
        }

        return nextStep;
    }

    @GetMapping(PUBLIC_SAMPLE_TASKS_ROUTE)
    public SampleTasks getSampleTasks(@RequestParam String scrollId, @NotNull @RequestParam Integer pageSize) {
        List<SampleTask> tasks = null;
        Optional<SampleTasks> cachedSampleTasks = sampleTasksRedisCache.findById(scrollId);
        if (cachedSampleTasks.isPresent()) {
            tasks = cachedSampleTasks.get().getSampleTasks();
        }
        SampleTasks sampleTasks = new SampleTasks();
        sampleTasks.setScrollId("");
        if (tasks == null) {
            return sampleTasks;
        }
        if (tasks.size() <= pageSize) {
            sampleTasks.setSampleTasks(tasks);
            sampleTasksRedisCache.deleteById(scrollId);
            return sampleTasks;
        }
        String newScrollId = UUID.randomUUID().toString();
        sampleTasks.setScrollId(newScrollId);
        sampleTasks.setSampleTasks(tasks.subList(0, pageSize));
        sampleTasksRedisCache.save(new SampleTasks(newScrollId, tasks.subList(pageSize, tasks.size())));
        return sampleTasks;
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

    @PostMapping(SAMPLE_TASKS_IMPORT_ROUTE)
    public List<SampleTask> importSampleTasks(@Valid @RequestBody ImportTasksParams importTasksParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        String scrollId = importTasksParams.getScrollId();
        if (StringUtils.isNotBlank(scrollId)) {
            Optional<SampleTasks> cachedSampleTasks = sampleTasksRedisCache.findById(scrollId);
            cachedSampleTasks.ifPresent(sampleTasks -> {
                importTasksParams.getSampleTasks().addAll(
                    sampleTasks.getSampleTasks().stream().map(SampleTask::getId).collect(Collectors.toList()));
                sampleTasksRedisCache.deleteById(scrollId);
            });
        }
        return this.ruleEngine.importTasks(username, importTasksParams);
    }

    @PostMapping(SAMPLE_TASKS_ROUTE)
    public SampleTask createSampleTask(@Valid @RequestBody CreateSampleTaskParams createSampleTaskParams) {
        validateRequester();
        return sampleTaskDaoJpa.createSampleTask(createSampleTaskParams).toPresentationModel();
    }

    @GetMapping(SAMPLE_TASK_ROUTE)
    public SampleTask getSampleTask(@NotNull @PathVariable Long sampleTaskId) {
        validateRequester();
        com.bulletjournal.templates.repository.model.SampleTask sampleTask =
                this.sampleTaskDaoJpa.findSampleTaskById(sampleTaskId);
        SampleTask result = sampleTask.toPresentationModel();
        Choice choice = this.sampleTaskDaoJpa.getSampleTaskChoice(sampleTask);
        if (choice != null) {
            result.setChoice(choice.toPresentationModel());
        }
        return result;
    }

    @GetMapping(SAMPLE_TASK_BY_METADATA)
    public List<SampleTask> getSampleTasksByFilter(@RequestParam(value = "filter") String metadataFilter) {
        // http://localhost:8080/api/sampleTasks?filter={filter}
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

    @PostMapping(SAMPLE_TASKS_RULE_ROUTE)
    public SampleTaskRule upsertSampleTaskRule(@Valid @RequestBody UpsertSampleTaskRuleParams upsertSampleTaskRuleParams) {
        validateRequester();
        return sampleTaskRuleDaoJpa.upsert(upsertSampleTaskRuleParams.getStepId(),
                upsertSampleTaskRuleParams.getSelectionCombo(),
                upsertSampleTaskRuleParams.getTaskIds()).toPresentationModel();
    }

    @DeleteMapping(SAMPLE_TASK_RULE_ROUTE)
    public void deleteSampleTaskRule(@RequestParam(value = "stepId") Long stepId,
                                 @RequestParam(value = "selectionCombo") String selectionCombo) {
        validateRequester();
        sampleTaskRuleDaoJpa.deleteById(stepId, selectionCombo);
    }

    @GetMapping(CATEGORY_STEPS_ROUTE)
    public CategorySteps getCategorySteps(@NotNull @PathVariable Long categoryId) {
        validateRequester();
        return categoryDaoJpa.getCategorySteps(categoryId);
    }

    @PostMapping(AUDIT_SAMPLE_TASK_ROUTE)
    public void auditSampleTask(@NotNull @PathVariable Long sampleTaskId,
                                @Valid @RequestBody AuditSampleTaskParams auditSampleTaskParams) {
        validateRequester();
        this.sampleTaskDaoJpa.auditSampleTask(sampleTaskId, auditSampleTaskParams);
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
