package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NewSampleTaskEvent;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.templates.controller.model.AuditSampleTaskParams;
import com.bulletjournal.templates.controller.model.CreateSampleTaskParams;
import com.bulletjournal.templates.controller.model.UpdateSampleTaskParams;
import com.bulletjournal.templates.repository.model.*;
import org.apache.http.util.TextUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class SampleTaskDaoJpa {

    @Autowired
    private SampleTaskRepository sampleTaskRepository;

    @Autowired
    private SampleTaskRuleDaoJpa sampleTaskRuleDaoJpa;

    @Autowired
    private ChoiceMetadataKeywordRepository choiceMetadataKeywordRepository;

    @Autowired
    private SelectionMetadataKeywordDaoJpa selectionMetadataKeywordDaoJpa;

    @Autowired
    private UserCategoryDaoJpa userCategoryDaoJpa;

    @Autowired
    private NotificationService notificationService;

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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask auditSampleTask(Long sampleTaskId, AuditSampleTaskParams auditSampleTaskParams) {
        SampleTask sampleTask = this.findSampleTaskById(sampleTaskId);
        sampleTask.setPending(false);
        String originalKeyword = sampleTask.getMetadata();
        List<SelectionMetadataKeyword> keywords =
                this.selectionMetadataKeywordDaoJpa.getKeywordsBySelections(auditSampleTaskParams.getSelections());
        for (SelectionMetadataKeyword keyword : keywords) {
            sampleTask.setMetadata(sampleTask.getMetadata() + "," + keyword.getKeyword());
        }
        this.save(sampleTask);

        // read redis and clean other admin notifications as well as self's

        this.sampleTaskRuleDaoJpa.updateSampleTaskRule(
                sampleTask, originalKeyword, auditSampleTaskParams.getSelections());

        // send notification to subscribed users
        List<UserCategory> users = this.userCategoryDaoJpa.getSubscribedUsersByMetadataKeyword(
                keywords.stream().map(SelectionMetadataKeyword::getKeyword).collect(Collectors.toList()));
        List<Event> events = new ArrayList<>();
        for (UserCategory user : users) {
            events.add(new Event(user.getUser().getName(), sampleTaskId, sampleTask.getName()));
        }
        this.notificationService.inform(new NewSampleTaskEvent(events, "BulletJournal"));
        return sampleTask;
    }
}
