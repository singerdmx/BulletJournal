package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.controller.model.CreateSampleTaskParams;
import com.bulletjournal.templates.controller.model.UpdateSampleTaskParams;
import com.bulletjournal.templates.repository.model.SampleTask;
import org.apache.http.util.TextUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class SampleTaskDaoJpa {

    @Autowired
    private SampleTaskRepository sampleTaskRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask createSampleTask(CreateSampleTaskParams createSampleTaskParams) {
        SampleTask sampleTask = new SampleTask();
        sampleTask.setContent(createSampleTaskParams.getContent());
        sampleTask.setMetadata(createSampleTaskParams.getMetadata());
        sampleTask.setName(createSampleTaskParams.getName());
        sampleTask.setUid(createSampleTaskParams.getUid());
        return sampleTaskRepository.save(sampleTask);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask findSampleTaskById(Long sampleTaskId) {
        SampleTask sampleTask = sampleTaskRepository.getById(sampleTaskId);
        if (sampleTask == null) {
            throw new ResourceNotFoundException("sample task id: " + sampleTaskId + " does not exist");
        }
        return sampleTask;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<SampleTask> findSampleTasksByMetadataFilter(String metadataFilter) {
        if (TextUtils.isBlank(metadataFilter)) {
            return sampleTaskRepository.findAll();
        }
        return sampleTaskRepository.getByMetadataFilter(metadataFilter);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask updateSampleTask(Long sampleTaskId, UpdateSampleTaskParams updateSampleTaskParams) {
        SampleTask sampleTask = findSampleTaskById(sampleTaskId);
        sampleTask.setName(updateSampleTaskParams.getName());
        sampleTask.setContent(updateSampleTaskParams.getContent());
        sampleTask.setMetadata(updateSampleTaskParams.getMetadata());
        sampleTask.setUid(updateSampleTaskParams.getUid());
        return sampleTaskRepository.save(sampleTask);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteSampleTaskById(Long sampleTaskId) {
        if (!sampleTaskRepository.existsById(sampleTaskId)) {
            throw new ResourceNotFoundException("sampleTask id " + sampleTaskId + " not exit");
        }
        sampleTaskRepository.deleteById(sampleTaskId);
    }
}
