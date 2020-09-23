package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.SampleTaskRule;
import com.bulletjournal.templates.repository.model.SampleTaskRuleId;
import com.bulletjournal.templates.repository.model.Step;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public class SampleTaskRuleDaoJpa {
    private SampleTaskRuleRepository sampleTaskRuleRepository;
    private StepRepository stepRepository;

    @Autowired
    SampleTaskRuleDaoJpa(SampleTaskRuleRepository sampleTaskRuleRepository, StepRepository stepRepository) {
        this.sampleTaskRuleRepository = sampleTaskRuleRepository;
        this.stepRepository = stepRepository;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTaskRule upsert(Long stepId, String selectionCombo, String taskIds) {
        return this.sampleTaskRuleRepository.upsert(stepId, selectionCombo, taskIds);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteById(Long stepId, String selectionCombo) {
        SampleTaskRuleId ruleId = new SampleTaskRuleId(fetchStepWithId(stepId), selectionCombo);
        if (!this.sampleTaskRuleRepository.existsById(ruleId)) {
            throw new ResourceNotFoundException("Selection with id: " + stepId +
                    "with selectionCombo " + selectionCombo + " doesn't exist, cannot delete.");
        }
        sampleTaskRuleRepository.deleteById(stepId, selectionCombo);
    }

    private Step fetchStepWithId(Long stepId) {
        Optional<Step> stepById = stepRepository.findById(stepId);
        if (!stepById.isPresent()) {
            throw new ResourceNotFoundException("Step with stepId " + stepById + " does not exist");
        }
        return stepById.get();
    }
}
