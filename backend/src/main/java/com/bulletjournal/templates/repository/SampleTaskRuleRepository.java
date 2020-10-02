package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SampleTaskRule;
import com.bulletjournal.templates.repository.model.SampleTaskRuleId;
import com.bulletjournal.templates.repository.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SampleTaskRuleRepository extends JpaRepository<SampleTaskRule, SampleTaskRuleId> {

    List<SampleTaskRule> findAllByStep(Step step);

    @Query(value = "insert into template.sample_task_rules (task_ids, step_id, selection_combo) "
            + "values(:taskIds, :stepId, :selectionCombo) "
            + "on conflict (step_id, selection_combo) "
            + "do "
            + "update set task_ids = :taskIds "
            + "returning *", nativeQuery = true)
    SampleTaskRule upsert(Long stepId, String selectionCombo, String taskIds);

    boolean existsById(SampleTaskRuleId ruleId);

    @Query(value = "delete from template.sample_task_rules sample_task_rules "
            + "where sample_task_rules.step_id = :stepId and "
            + "sample_task_rules.selection_combo = :selectionCombo "
            + "returning *", nativeQuery = true)
    String deleteById(Long stepId, String selectionCombo);

    List<SampleTaskRule> findAllBySelectionCombo(String selectionCombo);
}
