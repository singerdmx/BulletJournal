package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SampleTaskRule;
import com.bulletjournal.templates.repository.model.SampleTaskRuleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SampleTaskRuleRepository extends JpaRepository<SampleTaskRule, SampleTaskRuleId> {
}
