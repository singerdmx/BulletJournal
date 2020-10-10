package com.bulletjournal.templates.repository;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NewSampleTaskEvent;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.repository.NotificationRepository;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.Notification;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.templates.controller.model.AuditSampleTaskParams;
import com.bulletjournal.templates.controller.model.CreateSampleTaskParams;
import com.bulletjournal.templates.controller.model.UpdateSampleTaskParams;
import com.bulletjournal.templates.repository.model.*;
import com.bulletjournal.util.StringUtil;
import com.google.common.collect.ImmutableList;
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

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserSampleTaskDaoJpa userSampleTaskDaoJpa;

    @Autowired
    private SampleTaskNotificationsRepository sampleTaskNotificationsRepository;

    @Autowired
    private NotificationRepository notificationRepository;

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
        sampleTask.setPending(updateSampleTaskParams.isPending());
        return sampleTaskRepository.save(sampleTask);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask updateSampleTaskContent(Long sampleTaskId, String content) {
        SampleTask sampleTask = findSampleTaskById(sampleTaskId);
        sampleTask.setContent(content);
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
                this.selectionMetadataKeywordDaoJpa.getKeywordsBySelectionsWithoutFrequency(auditSampleTaskParams.getSelections());
        for (SelectionMetadataKeyword keyword : keywords) {
            sampleTask.setMetadata(sampleTask.getMetadata() + "," + keyword.getKeyword());
        }
        this.save(sampleTask);

        // clean other admin notifications as well as self's
        Optional<SampleTaskNotification> sampleTaskNotification =
                this.sampleTaskNotificationsRepository.findById(sampleTaskId);

        if (sampleTaskNotification.isPresent()) {
            List<Long> notificationIds = StringUtil.convertNumArray(sampleTaskNotification.get().getNotifications());
            List<Notification> notifications = this.notificationRepository.findAllById(notificationIds);
            this.notificationRepository.deleteInBatch(notifications);
        }

        this.sampleTaskRuleDaoJpa.updateSampleTaskRule(
                sampleTask, originalKeyword, auditSampleTaskParams.getSelections());

        // send notification to subscribed users
        List<UserCategory> users = this.userCategoryDaoJpa.getSubscribedUsersByMetadataKeyword(
                keywords.stream().map(SelectionMetadataKeyword::getKeyword).collect(Collectors.toList()));

        if (users.isEmpty()) {
            return sampleTask;
        }

        // if sample task has due date, directly push to task table
        if (sampleTask.hasDueDate()) {
            Map<String, User> userMap = this.userDaoJpa.getUsersByNames(
                    users.stream().map(u -> u.getUser().getName()).collect(Collectors.toSet()))
                    .stream().collect(Collectors.toMap(User::getName, u -> u));
            for (UserCategory user : users) {
                String username = user.getUser().getName();
                com.bulletjournal.templates.controller.model.SampleTask sampleTaskModel =
                        sampleTask.toPresentationModel();
                if (sampleTask.isRefreshable()) {
                    sampleTaskModel.setContent(null);
                }
                List<Task> createdTasks = this.taskDaoJpa.createTaskFromSampleTask(
                        user.getProject().getId(),
                        username,
                        ImmutableList.of(sampleTaskModel),
                        userMap.get(username).getReminderBeforeTask().getValue(),
                        ImmutableList.of(username),
                        Collections.emptyList());
                if (sampleTask.isRefreshable()) {
                    createdTasks.forEach(t -> t.setSampleTask(sampleTask));
                }
                this.taskDaoJpa.saveAll(createdTasks);

                this.notificationService.inform(
                        new NewSampleTaskEvent(
                                new Event(username, sampleTaskId, sampleTask.getName()),
                                "BulletJournal",
                                ContentType.getContentLink(ContentType.TASK, createdTasks.get(0).getId())));
            }
            return sampleTask;
        }

        // otherwise show up in punchCard page
        List<Event> events = new ArrayList<>();
        List<UserSampleTask> userSampleTasks = new ArrayList<>();
        for (UserCategory user : users) {
            userSampleTasks.add(new UserSampleTask(user.getUser(), sampleTask));
            events.add(new Event(user.getUser().getName(), sampleTaskId, sampleTask.getName()));
        }
        this.userSampleTaskDaoJpa.save(userSampleTasks);
        this.notificationService.inform(new NewSampleTaskEvent(events, "BulletJournal"));

        return sampleTask;
    }
}
