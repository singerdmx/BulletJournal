package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.controller.model.CreateSampleTaskParams;
import com.bulletjournal.templates.controller.model.UpdateSampleTaskParams;
import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.ChoiceMetadataKeyword;
import com.bulletjournal.templates.repository.model.SampleTask;
import org.apache.http.util.TextUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class SampleTaskDaoJpa {

    @Autowired
    private SampleTaskRepository sampleTaskRepository;

    @Autowired
    private ChoiceMetadataKeywordRepository choiceMetadataKeywordRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask createSampleTask(CreateSampleTaskParams createSampleTaskParams) {
        SampleTask sampleTask = new SampleTask();
        sampleTask.setContent(createSampleTaskParams.getContent());
        sampleTask.setMetadata(createSampleTaskParams.getMetadata());
        sampleTask.setName(createSampleTaskParams.getName());
        sampleTask.setUid(createSampleTaskParams.getUid());
        sampleTask.setTimeZone(createSampleTaskParams.getTimeZone());
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
    public Choice getSampleTaskChoice(SampleTask sampleTask) {
        if (!sampleTask.isPending()) {
            return null;
        }
        List<ChoiceMetadataKeyword> keywords = this.choiceMetadataKeywordRepository.findAll();
        int maxLen = 0;
        ChoiceMetadataKeyword keyword = null;
        for (ChoiceMetadataKeyword candidate : keywords) {
            if (candidate.getKeyword().length() > maxLen && sampleTask.getMetadata().contains(candidate.getKeyword())) {
                maxLen = candidate.getKeyword().length();
                keyword = candidate;
            }
        }
        if (keyword == null) {
            return null;
        }
        return keyword.getChoice();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<SampleTask> findAllById(Collection<Long> ids) {
        if (ids.isEmpty()) {
            return Collections.emptyList();
        }
        return this.sampleTaskRepository.findAllById(ids).stream().filter(Objects::nonNull).collect(Collectors.toList());
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
        sampleTask.setTimeZone(updateSampleTaskParams.getTimeZone());
        return sampleTaskRepository.save(sampleTask);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteSampleTaskById(Long sampleTaskId) {
        if (!sampleTaskRepository.existsById(sampleTaskId)) {
            throw new ResourceNotFoundException("sampleTask id " + sampleTaskId + " not exit");
        }
        sampleTaskRepository.deleteById(sampleTaskId);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask save(SampleTask sampleTask) {
        return this.sampleTaskRepository.save(sampleTask);
    }
}
