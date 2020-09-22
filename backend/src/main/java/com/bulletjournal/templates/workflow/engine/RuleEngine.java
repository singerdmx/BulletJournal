package com.bulletjournal.templates.workflow.engine;

import com.bulletjournal.templates.controller.model.SampleTask;
import com.bulletjournal.templates.repository.SampleTaskDaoJpa;
import com.bulletjournal.templates.repository.SampleTaskRuleRepository;
import com.bulletjournal.templates.repository.SelectionDaoJpa;
import com.bulletjournal.templates.repository.StepDaoJpa;
import com.bulletjournal.templates.repository.model.SampleTaskRule;
import com.bulletjournal.templates.repository.model.Selection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class RuleEngine {

    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;

    @Autowired
    private StepDaoJpa stepDaoJpa;

    @Autowired
    private SelectionDaoJpa selectionDaoJpa;

    @Autowired
    private SampleTaskRuleRepository sampleTaskRuleRepository;

    public List<SampleTask> getSampleTasksForFinalStep(
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
        Map<Long, Selection> selectionMap = allSelections.stream()
                .collect(Collectors.toMap(com.bulletjournal.templates.repository.model.Selection::getId, s -> s));

        // get task rules
        List<SampleTaskRule> rules = this.sampleTaskRuleRepository
                .findAllByStep(this.stepDaoJpa.getById(step.getId()));
        // filter rules so that only selections related rules are left
        rules = rules.stream().filter(rule -> rule
                .getSelectionIds().stream().allMatch(s -> allSelectionIds.contains(s)))
                .collect(Collectors.toList());

        // some choices are not applicable such as Intensity or 'Computer Science Category'
        Set<Long> applicableChoices = new HashSet<>();
        rules.forEach(rule -> rule.getSelectionIds()
                .forEach(s -> {
                    Long choiceId = selectionMap.get(s).getChoice().getId();
                    if (!applicableChoices.contains(choiceId)) {
                        applicableChoices.add(choiceId);
                    }
                }));

        // choice id -> its selections
        Map<Long, List<com.bulletjournal.templates.repository.model.Selection>> allChoices = new HashMap<>();
        allSelections.forEach(s -> {
            Long choiceId = s.getChoice().getId();
            if (applicableChoices.contains(choiceId)) {
                allChoices.computeIfAbsent(choiceId, k -> new ArrayList<>()).add(s);
            }
        });
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

            choiceIds.forEach(choiceId -> allChoices.remove(choiceId));
        }

        for (List<com.bulletjournal.templates.repository.model.Selection> selected : allChoices.values()) {
            Set<Long> tmpResult = new HashSet<>();
            for (com.bulletjournal.templates.repository.model.Selection selection : selected) {
                // Selections in one choice => union of List<SampleTask>
                SampleTaskRule r = ruleMap.remove(Long.toString(selection.getId()));
                if (r != null) {
                    tmpResult.addAll(r.getSampleTaskIds());
                }
            }

            // Selections between choices => intersection of List<SampleTask>
            result.retainAll(tmpResult);
        }

        // result -> sampleTaskDaoJpa batch get -> toPresentation
        return sampleTaskDaoJpa.findAllById(result).stream().map(e -> e.toPresentationModel()).collect(Collectors.toList());
    }
}
