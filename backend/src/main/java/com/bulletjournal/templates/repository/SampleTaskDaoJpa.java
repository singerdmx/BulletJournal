package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.controller.model.CreateSampleTaskParams;
import com.bulletjournal.templates.repository.model.SampleTask;
import com.bulletjournal.templates.repository.model.Step;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class SampleTaskDaoJpa {

    @Autowired
    private SampleTaskRepository sampleTaskRepository;

    @Autowired
    private StepRepository stepRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask createSampleTask(CreateSampleTaskParams createSampleTaskParams) {
        SampleTask sampleTask = new SampleTask();
        sampleTask.setContent(createSampleTaskParams.getContent());
        sampleTask.setMetadata(createSampleTaskParams.getMetadata());
        sampleTask.setName(createSampleTaskParams.getName());
        if (createSampleTaskParams.getStepIds() != null) {
            List<Step> stepList = stepRepository.findAllById(createSampleTaskParams.getStepIds());
            sampleTask.setSteps(stepList);
        }
        return sampleTaskRepository.save(sampleTask);
    }
}
