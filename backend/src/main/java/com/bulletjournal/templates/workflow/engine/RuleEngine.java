package com.bulletjournal.templates.workflow.engine;

import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.templates.controller.model.ImportTasksParams;
import com.bulletjournal.templates.repository.*;
import com.bulletjournal.templates.repository.model.*;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RuleEngine {

    private static final Map<Long, Integer> DEFAULT_INTENSITY_SELECTIONS = ImmutableMap.of(
            247L, 2, // Low -> twice a day
            248L, 4, // Medium -> 4 times a day
            249L, 8); // Hard -> 8 times a day

    // category id -> INTENSITY_SELECTIONS
    private static final Map<Long, Map<Long, Integer>> CATEGORY_INTENSITY_SELECTIONS =  ImmutableMap.of();

    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;

    @Autowired
    private StepDaoJpa stepDaoJpa;

    @Autowired
    private SelectionDaoJpa selectionDaoJpa;

    @Autowired
    private SampleTaskRuleRepository sampleTaskRuleRepository;

    @Autowired
    private SampleTaskRuleDaoJpa sampleTaskRuleDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private UserCategoryDaoJpa userCategoryDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.templates.controller.model.SampleTask> importTasks(String requester, ImportTasksParams importTasksParams) {
        List<com.bulletjournal.templates.controller.model.SampleTask> sampleTasks = sampleTaskDaoJpa
                .findAllById(importTasksParams.getSampleTasks()).stream().map(SampleTask::toPresentationModel).collect(Collectors.toList());
        // if there is any sample task that does not have due date, we need to set due date for it
        List<com.bulletjournal.templates.controller.model.SampleTask> tasksNeedTimingArrangement = sampleTasks.stream()
                .filter(t -> StringUtils.isBlank(t.getDueDate())).collect(Collectors.toList());

        User user = this.userDaoJpa.getByName(requester);

        String timezone = importTasksParams.getTimezone();
        if (StringUtils.isBlank(timezone)) {
            timezone = user.getTimezone();
        }
        if (!tasksNeedTimingArrangement.isEmpty()) {
            tasksNeedTimingArrangement.sort(Comparator.comparingInt(a -> Integer.parseInt(a.getUid())));
            // calculate start date
            ZonedDateTime startDay;
            if (StringUtils.isNotBlank(importTasksParams.getStartDate())) {
                startDay = ZonedDateTimeHelper.getStartTime(
                        importTasksParams.getStartDate(), null, timezone);
            } else {
                startDay = ZonedDateTimeHelper.getStartTime(
                        ZonedDateTime.now().plusDays(1).format(ZonedDateTimeHelper.DATE_FORMATTER), null, timezone);
            }
            int frequency = getTimesOneDay(importTasksParams.getSelections(), importTasksParams.getCategoryId());
            int startIndex = 0;
            int numOfDay = 0;
            while (startIndex < tasksNeedTimingArrangement.size()) {
                ZonedDateTime startTime = startDay.plusHours(21).plusDays(numOfDay++);
                for (int i = 0; i < frequency && startIndex < tasksNeedTimingArrangement.size(); startIndex++, i++) {
                    com.bulletjournal.templates.controller.model.SampleTask sampleTask = tasksNeedTimingArrangement.get(startIndex);
                    sampleTask.setDueDate(startTime.format(ZonedDateTimeHelper.DATE_FORMATTER));
                    sampleTask.setDueTime(startTime.format(ZonedDateTimeHelper.TIME_FORMATTER));
                    sampleTask.setTimeZone(timezone);
                    startTime = startTime.minusHours(1);
                }
            }
        }

        this.taskDaoJpa.createTaskFromSampleTask(importTasksParams.getProjectId(), requester, tasksNeedTimingArrangement, importTasksParams.getReminderBefore(), importTasksParams.getAssignees(), importTasksParams.getLabels());

        if (importTasksParams.isSubscribed()) {
            this.userCategoryDaoJpa.upsertUserCategories(user, importTasksParams.getCategoryId(),
                    importTasksParams.getSelections(), importTasksParams.getProjectId());
        }

        return sampleTasks;
    }

    private int getTimesOneDay(List<Long> selections, long categoryId) {
        Map<Long, Integer> frequencyMap = CATEGORY_INTENSITY_SELECTIONS
                .getOrDefault(categoryId, DEFAULT_INTENSITY_SELECTIONS);
        long selectionId = selections.stream().filter(s -> frequencyMap.containsKey(s)).findFirst().orElseThrow(
                () -> new BadRequestException("Selections missing intensity"));
        return frequencyMap.get(selectionId);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Set<Long> getSampleTasksForFinalStep(long stepId,
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
        List<Selection> allSelections =
                this.selectionDaoJpa.getSelectionsById(allSelectionIds);
        Map<Long, Selection> selectionMap = allSelections.stream()
                .collect(Collectors.toMap(Selection::getId, s -> s));

        // get task rules
        List<SampleTaskRule> rules = this.sampleTaskRuleRepository
                .findAllByStep(this.stepDaoJpa.getById(stepId));
        // filter rules so that only selections related rules are left
        rules = rules.stream().filter(rule -> rule
                .getSelectionIds().stream().allMatch(s -> allSelectionIds.contains(s)))
                .collect(Collectors.toList());

        // some choices are not applicable such as Intensity or 'Computer Science Category'
        Set<Long> applicableChoices = new HashSet<>();
        validateRuleSelectionIds(rules);
        rules.forEach(rule -> rule.getSelectionIds()
                .forEach(s -> {
                    Long choiceId = selectionMap.get(s).getChoice().getId();
                    if (!applicableChoices.contains(choiceId)) {
                        applicableChoices.add(choiceId);
                    }
                }));

        // choice id -> its selections
        Map<Long, List<Selection>> allChoices = new HashMap<>();
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

        for (List<Selection> selected : allChoices.values()) {
            Set<Long> tmpResult = new HashSet<>();
            for (Selection selection : selected) {
                // Selections in one choice => union of List<SampleTask>
                SampleTaskRule r = ruleMap.remove(Long.toString(selection.getId()));
                if (r != null) {
                    tmpResult.addAll(r.getSampleTaskIds());
                }
            }

            // Selections between choices => intersection of List<SampleTask>
            result.retainAll(tmpResult);
        }

        return result;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    protected void validateRuleSelectionIds(List<SampleTaskRule> rules) {
        for (SampleTaskRule rule : rules) {
            List<Long> l = this.sampleTaskDaoJpa.findAllById(rule.getSampleTaskIds())
                    .stream().map(s -> s.getId()).sorted().collect(Collectors.toList());
            String valid = StringUtils.join(l, ",");
            if (!Objects.equals(valid, rule.getTaskIds())) {
                this.sampleTaskRuleDaoJpa.upsert(rule.getStep().getId(), rule.getSelectionCombo(), valid);
            }
        }
    }
}
