package com.bulletjournal.templates.repository;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NewAdminSampleTaskEvent;
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
import com.bulletjournal.templates.repository.utils.InvestmentUtil;
import com.bulletjournal.util.DeltaConverter;
import com.bulletjournal.util.StringUtil;
import com.google.common.collect.ImmutableList;
import org.apache.http.util.TextUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class SampleTaskDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(SampleTaskDaoJpa.class);

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

    @Autowired
    private StockTickerDetailsDaoJpa stockTickerDetailsDaoJpa;

    @Autowired
    private StockTickerDetailsRepository stockTickerDetailsRepository;

    @Autowired
    private SelectionRepository selectionRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask createSampleTask(CreateSampleTaskParams createSampleTaskParams) {
        SampleTask sampleTask = new SampleTask();
        sampleTask.setContent(createSampleTaskParams.getContent());
        sampleTask.setMetadata(createSampleTaskParams.getMetadata());
        sampleTask.setName(createSampleTaskParams.getName());
        sampleTask.setUid(createSampleTaskParams.getUid());
        sampleTask.setTimeZone(createSampleTaskParams.getTimeZone());
        return this.save(sampleTask);
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
        sampleTask.setRefreshable(updateSampleTaskParams.isRefreshable());
        return this.save(sampleTask);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask updateSampleTaskContent(Long sampleTaskId, String content) {
        SampleTask sampleTask = findSampleTaskById(sampleTaskId);
        sampleTask.setContent(content);
        return this.save(sampleTask);
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
        if (sampleTask.hasContent()) {
            sampleTask.setContent(
                    DeltaConverter.supplementContentText(sampleTask.getContent(), false));
        }
        return this.sampleTaskRepository.save(sampleTask);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SampleTask auditSampleTask(Long sampleTaskId, AuditSampleTaskParams auditSampleTaskParams) {
        SampleTask sampleTask = this.findSampleTaskById(sampleTaskId);
        sampleTask.setPending(false);
        String originalKeyword = sampleTask.getMetadata();
        if (auditSampleTaskParams.getSelections().isEmpty()) {
            throw new BadRequestException("Empty Selections");
        }
        auditSelection(sampleTask, auditSampleTaskParams.getSelections());
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
            this.sampleTaskNotificationsRepository.delete(sampleTaskNotification.get());
        }

        this.sampleTaskRuleDaoJpa.updateSampleTaskRule(
                sampleTask, originalKeyword, auditSampleTaskParams.getSelections());

        // send notification to subscribed users
        List<UserCategory> users = this.userCategoryDaoJpa.getSubscribedUsersByMetadataKeyword(
                keywords.stream().map(SelectionMetadataKeyword::getKeyword).collect(Collectors.toList()));
        if (InvestmentUtil.isInvestmentSampleTask(sampleTask)) {
            String categoryNameKeyword = InvestmentUtil.getCategoryNameKeyword(sampleTask.getMetadata());
            LOGGER.info("Filter users on categoryNameKeyword {}", categoryNameKeyword);
            users = users.stream()
                    .filter(u -> u.getCategory().getName().toLowerCase().contains(categoryNameKeyword))
                    .collect(Collectors.toList());
        }

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
                try {
                    List<Task> createdTasks = this.taskDaoJpa.createTaskFromSampleTask(
                            user.getProject().getId(),
                            username,
                            ImmutableList.of(sampleTaskModel),
                            ImmutableList.of(sampleTask),
                            userMap.get(username).getReminderBeforeTask().getValue(),
                            ImmutableList.of(username),
                            Collections.emptyList());

                    if (!createdTasks.isEmpty()) {
                        this.notificationService.inform(
                                new NewSampleTaskEvent(
                                        new Event(username, sampleTaskId, sampleTask.getName()),
                                        "BulletJournal",
                                        ContentType.getContentLink(ContentType.TASK, createdTasks.get(0).getId())));
                    }
                } catch (Exception ex) {
                    LOGGER.error("Failure to create task for subscribed user " + username, ex);
                }
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

    private void auditSelection(SampleTask sampleTask, List<Long> selections) {
        // selection
        Optional<Long> match = selections.stream().filter(s -> s != null && s >= 250 && s <= 260).findFirst();
        if (match.isPresent()) {
            InvestmentUtil investmentUtil = InvestmentUtil.getInstance(sampleTask.getMetadata(), sampleTask.getRaw());
            if (!this.stockTickerDetailsRepository.existsById(investmentUtil.getTicker())) {
                Selection selection = selectionRepository.findById(match.get()).orElseThrow(
                        () -> new ResourceNotFoundException("Selection" + match.get() + "not found"));
                StockTickerDetails stockTickerDetails = new StockTickerDetails();
                stockTickerDetails.setSelection(selection);
                stockTickerDetails.setExpirationTime(new Timestamp(System.currentTimeMillis() + StockTickerDetailsDaoJpa.MILLS_IN_YEAR));
                stockTickerDetails.setDetails("");
                stockTickerDetails.setTicker(investmentUtil.getTicker());
                stockTickerDetails = stockTickerDetailsRepository.save(stockTickerDetails);
                LOGGER.info("Created stock detail {}", stockTickerDetails);
            }
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void handleSampleTaskChange(long id) {
        SampleTask sampleTask = findSampleTaskById(id);
        if (InvestmentUtil.isInvestmentSampleTask(sampleTask)) {
            handleSampleTaskRecord(sampleTask, InvestmentUtil.getInstance(sampleTask.getMetadata(), sampleTask.getRaw()));
        }
    }

    private void handleSampleTaskRecord(SampleTask sampleTask, InvestmentUtil investmentUtil) {
        if ("OTC".equals(investmentUtil.getExchange())) {
            LOGGER.info("Skip OTC exchange {}", sampleTask.getRaw());
            return;
        }
        com.bulletjournal.templates.controller.model.StockTickerDetails stockTickerDetails =
                this.stockTickerDetailsDaoJpa.get(investmentUtil.getTicker());

        if (stockTickerDetails == null) {
            String sampleTaskName = sampleTask.getName().toLowerCase();
            Long selectionId = null;
            for (Map.Entry<Long, List<String>> entry : StockTickerDetailsDaoJpa.SECTOR_KEYWORD.entrySet()) {
                if (entry.getValue().stream().anyMatch(v -> sampleTaskName.contains(v))) {
                    selectionId = entry.getKey();
                    break;
                }
            }
            if (selectionId != null) {
                final long targetSelectionId = selectionId;
                Selection selection = selectionRepository.findById(targetSelectionId).orElseThrow(
                        () -> new ResourceNotFoundException("Selection" + targetSelectionId + "not found"));
                StockTickerDetails sd = new StockTickerDetails();
                sd.setSelection(selection);
                sd.setExpirationTime(new Timestamp(System.currentTimeMillis() + StockTickerDetailsDaoJpa.MILLS_IN_YEAR));
                sd.setDetails("");
                sd.setTicker(investmentUtil.getTicker());
                sd = stockTickerDetailsRepository.save(sd);
                stockTickerDetails = sd.toPresentationModelWithChoice();
            }
        }

        try {
            String content = investmentUtil.getContent(stockTickerDetails);
            sampleTask.setContent(content);
            this.save(sampleTask);
            if (stockTickerDetails == null) {
                notifyAdmins(sampleTask);
                return;
            }
            // stockTickerDetails exists
            if (sampleTask.isPending()) {
                this.auditSampleTask(sampleTask.getId(), new AuditSampleTaskParams(
                        stockTickerDetails.getSelection().getChoice().getId(),
                        ImmutableList.of(stockTickerDetails.getSelection().getId())));
            }
        } catch (Exception ex) {
            LOGGER.error("investmentUtil#getContent failed", ex);
            notifyAdmins(sampleTask);
        }
    }

    private void notifyAdmins(SampleTask sampleTask) {
        if (!sampleTask.isPending()) {
            LOGGER.info("Sample Task {} is not pending. Skip notifyAdmins", sampleTask.getId());
            return;
        }
        // 1. get all admin usernames (role in users table)
        // List<User> users = this.userDaoJpa.getUsersByRole(Role.ADMIN);
        List<String> users = ImmutableList.of("bbs1024");
        // 2. generate notifications
        this.notificationService.inform(
                new NewAdminSampleTaskEvent(
                        users.stream().map(u -> new Event(u, sampleTask.getId(), sampleTask.getName()))
                                .collect(Collectors.toList()),
                        "BulletJournal"));
    }
}
