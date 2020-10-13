package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.*;
import com.bulletjournal.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class SampleTaskRuleDaoJpa {
    private static final Logger LOGGER = LoggerFactory.getLogger(SampleTaskRuleDaoJpa.class);
    private SampleTaskRuleRepository sampleTaskRuleRepository;
    private StepRepository stepRepository;
    private StepMetadataKeywordRepository stepMetadataKeywordRepository;

    @Autowired
    SampleTaskRuleDaoJpa(SampleTaskRuleRepository sampleTaskRuleRepository,
                         StepRepository stepRepository,
                         StepMetadataKeywordRepository stepMetadataKeywordRepository) {
        this.sampleTaskRuleRepository = sampleTaskRuleRepository;
        this.stepRepository = stepRepository;
        this.stepMetadataKeywordRepository = stepMetadataKeywordRepository;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void saveAll(Iterable<SampleTaskRule> sampleTaskRules) {
        this.sampleTaskRuleRepository.saveAll(sampleTaskRules);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTaskRule upsert(Long stepId, String selectionCombo, String taskIds) {
        selectionCombo = StringUtils.join(StringUtil.convertNumArray(selectionCombo), ",");
        taskIds = StringUtils.join(StringUtil.convertNumArray(taskIds), ",");
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateSampleTaskRule(SampleTask sampleTask, String keyword, List<Long> selections) {
        for (String k : keyword.split(",")) {
            k = k.trim();
            Optional<StepMetadataKeyword> stepMetadataKeyword = this.stepMetadataKeywordRepository.findById(k);
            if (!stepMetadataKeyword.isPresent()) {
               continue;
            }
            Step step = stepMetadataKeyword.get().getStep();
            for (Long selection : selections) {
                String selectionCombo = Long.toString(selection);
                SampleTaskRuleId ruleId = new SampleTaskRuleId(step, selectionCombo);
                Optional<SampleTaskRule> rule = this.sampleTaskRuleRepository.findById(ruleId);
                List<Long> l = new ArrayList<>();
                if (rule.isPresent()) {
                    l = rule.get().getSampleTaskIds();
                }
                l.add(sampleTask.getId());
                this.upsert(step.getId(), selectionCombo,
                        l.stream().distinct().sorted().map(s -> Long.toString(s)).collect(Collectors.joining(",")));
            }
        }
    }
}
