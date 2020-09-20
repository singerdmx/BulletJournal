package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SampleTaskRule;
import com.bulletjournal.templates.repository.model.SampleTaskRuleId;
import com.bulletjournal.templates.repository.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SampleTaskRuleRepository extends JpaRepository<SampleTaskRule, SampleTaskRuleId> {

    List<SampleTaskRule> findAllByStep(Step step);
}
