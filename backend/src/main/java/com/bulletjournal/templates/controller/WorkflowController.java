package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.*;
import com.bulletjournal.templates.repository.model.Category;
import com.bulletjournal.templates.repository.model.CategoryRule;
import com.bulletjournal.templates.repository.model.Step;
import com.bulletjournal.templates.repository.model.StepRule;
import com.bulletjournal.templates.repository.model.SampleTaskRule;
import com.bulletjournal.templates.workflow.models.RuleExpression;
import com.google.gson.Gson;
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
    public static final String SAMPLE_TASKS_ROUTE = "/api/sampleTasks";
    public static final String SAMPLE_TASK_ROUTE = "/api/sampleTasks/{sampleTaskId}";
    public static final String SAMPLE_TASK_BY_METADATA = "/api/sampleTasks";

    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private CategoryDaoJpa categoryDaoJpa;

    @Autowired
    private StepDaoJpa stepDaoJpa;

    @Autowired
    private SelectionDaoJpa selectionDaoJpa;

    @Autowired
    private SampleTaskRuleRepository sampleTaskRuleRepository;

    private static final Gson GSON = new Gson();

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
                List<SampleTask> sampleTasks = getSampleTasksForFinalStep(
                        nextStep.getStep(), selections, prevSelections);
                // store in redis and generate scrollId
                // setSampleTasks with the first 10 tasks
                nextStep.setScrollId("scrollId");
                nextStep.setSampleTasks(sampleTasks);
            }
        }

        return nextStep;
    }

    @GetMapping(PUBLIC_SAMPLE_TASKS_ROUTE)
    public List<SampleTask> getSampleTasks(@RequestParam String scrollId) {
        return new ArrayList<>();
    }

    private List<SampleTask> getSampleTasksForFinalStep(
            com.bulletjournal.templates.controller.model.Step step,
            List<Long> selections,
            List<Long> prevSelections) {
        if (selections == null) {
            selections = Collections.emptyList();
        }
        if (prevSelections == null) {
            prevSelections = Collections.emptyList();
        }
        Set<Long> allSelectionIds = new HashSet<>(selections);
        allSelectionIds.addAll(prevSelections);
        List<com.bulletjournal.templates.repository.model.Selection> allSelections =
                this.selectionDaoJpa.getSelectionsById(allSelectionIds);
        Map<Long, com.bulletjournal.templates.repository.model.Selection> selectionMap = allSelections.stream()
                .collect(Collectors.toMap(com.bulletjournal.templates.repository.model.Selection::getId, s -> s));

        // choice id -> its selections
        Map<Long, List<com.bulletjournal.templates.repository.model.Selection>> allChoices = new HashMap<>();
        allSelections.forEach(s -> allChoices.computeIfAbsent(s.getChoice().getId(), k -> new ArrayList<>()).add(s));

        // get task rules
        List<SampleTaskRule> rules = this.sampleTaskRuleRepository
                .findAllByStep(this.stepDaoJpa.getById(step.getId()));
        rules = rules.stream().filter(rule -> rule
                .getSelectionIds().stream().allMatch(s -> allSelectionIds.contains(s)))
                .collect(Collectors.toList());

        Map<String, SampleTaskRule> ruleMap = rules.stream()
                .collect(Collectors.toMap(SampleTaskRule::getSelectionCombo, r -> r));

        // resulting sample task ids
        Set<Long> result = new HashSet<>();
        // find choice combo if there is selection combo in any task rule
        for (SampleTaskRule rule : rules) {
            if (rule.getSelectionIds().size() < 2) {
                continue;
            }
            Set<Long> choiceIds = new HashSet<>();
            rule.getSelectionIds().forEach(s -> choiceIds.add(selectionMap.get(s).getChoice().getId()));
            if (choiceIds.size() < 2) {
                continue;
            }
            // union for choice combo
            result.addAll(rule.getSampleTaskIds());
            allSelectionIds.removeAll(rule.getSampleTaskIds());

            rule.getSelectionIds().forEach(s -> {
                Long k = selectionMap.get(s).getChoice().getId();
                allChoices.get(k).remove(s);
                if (allChoices.get(k).isEmpty()) {
                    allChoices.remove(k);
                }
            });

            ruleMap.remove(rule.getSelectionCombo());
        }

        for (List<com.bulletjournal.templates.repository.model.Selection> selected : allChoices.values()) {
            Set<Long> tmpResult = new HashSet<>();
            for (com.bulletjournal.templates.repository.model.Selection selection : selected) {
                // Selections in one choice => union of List<SampleTask>
                SampleTaskRule r = ruleMap.remove(Long.toString(selection.getId()));
                tmpResult.addAll(r.getSampleTaskIds());
            }

            // Selections between choices => intersection of List<SampleTask>
            result.retainAll(tmpResult);
        }

        // result -> sampleTaskDaoJpa batch get -> toPresentation
        return new ArrayList<>();
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

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
