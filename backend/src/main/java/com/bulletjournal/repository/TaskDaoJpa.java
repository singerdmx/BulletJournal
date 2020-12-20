package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.daemon.models.ReminderRecord;
import com.bulletjournal.es.ESUtil;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.TaskRelationsProcessor;
import com.bulletjournal.notifications.ContentBatch;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.UpdateTaskAssigneeEvent;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.bulletjournal.templates.repository.model.SampleTask;
import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.dmfs.rfc5545.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class TaskDaoJpa extends ProjectItemDaoJpa<TaskContent> {
    private static final String EVERYONE = "Everyone";
    private static final Logger LOGGER = LoggerFactory.getLogger(TaskDaoJpa.class);
    private static final Gson GSON = new Gson();

    private static final Gson GSON_ALLOW_EXPOSE_ONLY = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
            .create();

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Autowired
    private ProjectTasksRepository projectTasksRepository;

    @Autowired
    private AuthorizationService authorizationService;

    @Autowired
    private CompletedTaskRepository completedTaskRepository;

    @Autowired
    private TaskContentRepository taskContentRepository;

    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;

    @Autowired
    private SearchIndexDaoJpa searchIndexDaoJpa;

    @Override
    public JpaRepository getJpaRepository() {
        return this.taskRepository;
    }

    /**
     * Get all tasks from project
     *
     * @param projectId the project identifier
     * @param requester the username of action requester
     * @return List<com.bulletjournal.controller.models.Task> - a list of controller
     * model tasks with labels
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 100))
    public List<com.bulletjournal.controller.models.Task> getTasks(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);

        // source of truth
        List<Task> tasks = project.isShared() ? this.sharedProjectItemDaoJpa.
                getSharedProjectItems(requester, ContentType.TASK).stream()
                .filter(obj -> obj instanceof Task)
                .map(projectItemModel -> (Task) projectItemModel).collect(Collectors.toList()) :
                this.taskRepository.findTaskByProject(project);

        List<com.bulletjournal.controller.models.Task> ret = new ArrayList<>();
        if (projectTasksOptional.isPresent()) {
            ProjectTasks projectTasks = projectTasksOptional.get();
            Set<Long> existingIds = tasks.stream().map(task -> task.getId()).collect(Collectors.toSet());

            Pair<List<HierarchyItem>, Set<Long>> hierarchy =
                    HierarchyProcessor.findAllIds(projectTasks.getTasks(), existingIds);

            List<HierarchyItem> keptHierarchy = hierarchy.getLeft();
            Set<Long> processedIds = hierarchy.getRight();

            final Map<Long, Task> taskMap = tasks.stream().filter(t -> processedIds.contains(t.getId()))
                    .collect(Collectors.toMap(n -> n.getId(), n -> n));

            ret.addAll(TaskRelationsProcessor.processRelations(taskMap, keptHierarchy).stream()
                    .map(task -> addLabels(task, taskMap)).collect(Collectors.toList()));

            tasks = tasks.stream().filter(t -> !processedIds.contains(t.getId())).collect(Collectors.toList());
        }

        ret.addAll(this.labelDaoJpa.getLabelsForProjectItemList(
                tasks.stream().sorted(Comparator.comparingLong(Task::getId))
                        .map(Task::toPresentationModel).collect(Collectors.toList())));
        return ret;
    }

    /**
     * Retrieve assignee's task by project id
     * <p>
     * 1. Check if project is shared to requester. If not, return empty list. 2.
     * Return assignee's task list and sort by end time
     *
     * @param projectId the project Id of task
     * @param requester the requester username
     * @param assignee  the assignee of task
     * @return a list of tasks assigned to assignee
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getTasksByAssignee(Long projectId, String requester,
                                                                             String assignee) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        if (project.isShared()) {
            return Collections.emptyList();
        }

        List<Task> tasks = this.taskRepository.findTasksByAssigneeAndProject(assignee, projectId);
        tasks.sort(ProjectItemsGrouper.TASK_COMPARATOR);
        return tasks.stream().map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            return t.toPresentationModel(labels);
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getTasksByOrder(Long projectId, String requester,
                                                                          String startDate, String endDate, String timezone) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        List<Task> tasks;
        if (project.isShared()) {
            tasks = this.sharedProjectItemDaoJpa.
                    getSharedProjectItems(requester, ContentType.TASK).stream()
                    .filter(obj -> obj instanceof Task)
                    .map(projectItemModel -> (Task) projectItemModel).collect(Collectors.toList());
        } else {
            if (StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate)) {
                tasks = this.taskRepository.findTaskByProject(project);
            } else {
                // Set start time and end time
                ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
                ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);
                tasks = this.taskRepository.findTasksBetween(project, Timestamp.from(startTime.toInstant()),
                        Timestamp.from(endTime.toInstant()));
                tasks.addAll(getAllRemindingRecurringTasksByProjectBetween(project, startTime, endTime));
            }
        }

        tasks.sort(ProjectItemsGrouper.TASK_COMPARATOR);
        return this.labelDaoJpa.getLabelsForProjectItemList(tasks.stream()
                .map(Task::toPresentationModel).collect(Collectors.toList()));
    }

    /**
     * Apply labels to tasks
     *
     * @param task     the task object
     * @param tasksMap the Map object mapping relationship between TaskId and Task
     *                 Instance
     * @return com.bulletjournal.controller.models.Task - task instance with labels
     */
    private com.bulletjournal.controller.models.Task addLabels(com.bulletjournal.controller.models.Task task,
                                                               Map<Long, Task> tasksMap) {
        List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(tasksMap.get(task.getId()));
        task.setLabels(labels);
        for (com.bulletjournal.controller.models.Task subTask : task.getSubTasks()) {
            addLabels(subTask, tasksMap);
        }
        return task;
    }

    public Pair<Task, List<Event>> setTaskStatus(TaskStatus taskStatus, Long taskId, String requester) {
        Task task = this.getProjectItem(taskId, requester);
        task.setStatus(taskStatus == null ? null : taskStatus.getValue());
        this.taskRepository.save(task);
        return Pair.of(task, generateEvents(task, requester, task.getProject()));
    }

    /**
     * Get completed task by task identifier
     * <p>
     * 1. Get task from database 2. Look up task labels and add to task
     *
     * @param requester the username of action requester
     * @param id        the task identifier
     * @return com.bulletjournal.controller.models.Task - controller model task with
     * label
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.Task getTask(String requester, Long id) {
        Task task = this.getProjectItem(id, requester);
        List<com.bulletjournal.controller.models.Label> labels = this.getLabelsToProjectItem(task);
        return task.toPresentationModel(labels);
    }

    /**
     * Get completed tasks from database
     *
     * @param id the task id
     * @return List<com.bulletjournal.controller.models.Task> - a list of completed
     * tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CompletedTask getCompletedTask(Long id, String requester) {
        CompletedTask task = this.completedTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + id + " not found"));
        this.authorizationService.validateRequesterInProjectGroup(requester, task.getProject());
        task.setLabels(Collections.emptyList());
        return task;
    }

    /**
     * Get user's tasks between the request start time and request end time.
     *
     * @param assignee  the username of task assignee
     * @param startTime the ZonedDateTime object of start time
     * @param endTime   the ZonedDateTime object of end time
     * @return List<com.bulletjournal.controller.models.Task> - a list of tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getTasksBetween(
            String assignee, ZonedDateTime startTime, ZonedDateTime endTime, List<Project> projects) {
        List<Long> projectIds = projects.stream().map(Project::getId).collect(Collectors.toList());
        List<Task> tasks = this.taskRepository.findTasksOfAssigneeBetween(assignee,
                ZonedDateTimeHelper.toDBTimestamp(startTime), ZonedDateTimeHelper.toDBTimestamp(endTime), projectIds);
        tasks = tasks.stream().filter(t -> {
            if (Objects.isNull(t.getRecurrenceRule())) {
                return true;
            }
            LOGGER.error("Recurring Task {} with Due DateTime.", t.getId());
            return false;
        }).collect(Collectors.toList());

        List<Task> recurrentTasks = this.getRecurringTaskOfAssignee(assignee, startTime, endTime);

        tasks.addAll(recurrentTasks);
        return tasks;
    }

    /**
     * Get recurring reminding tasks from database.
     * <p>
     * Reminding tasks qualifications:
     * 1. Reminding Time is before current time.
     * 2. Starting time is after the current time.
     *
     * @param assignee the username of task assignee
     * @param now      the ZonedDateTime object of the current time
     * @return List<com.bulletjournal.controller.models.Task> - a list of tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getRecurringTaskNeedReminding(final String assignee,
                                                                                        final ZonedDateTime now) {
        ZonedDateTime maxRemindingTime = now.plusHours(ZonedDateTimeHelper.MAX_HOURS_BEFORE);
        return this.getRecurringTaskOfAssignee(assignee, now, maxRemindingTime).stream()
                .filter(t -> t.hasReminderDateTime() &&
                        t.getReminderDateTime().before(ZonedDateTimeHelper.getTimestamp(now)) &&
                        t.getStartTime().after(ZonedDateTimeHelper.getTimestamp(now)))
                .map(t -> t.toPresentationModel()).collect(Collectors.toList());
    }

    /**
     * Get all recurrent tasks in [startTime, endTime]
     * <p>
     * Procedure:
     * 1. Iterate through input recurrent tasks
     * 2. Obtain new DateTime instance by using RecurrenceRule iterator
     * 3. Clone the original recurring task and set its start/end time and reminding setting
     *
     * @param recurrentTasks a list of tasks with recurrence rule
     * @param startTime      the ZonedDateTime object of start time
     * @param endTime        the ZonedDateTime object of end time
     * @return List<Task> - a list of recurrent tasks within the time range
     */
    public List<Task> getRecurringTasks(List<Task> recurrentTasks, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> recurringTasksBetween = new ArrayList<>();

        for (Task t : recurrentTasks) {
            List<Task> recurringTasks = DaoHelper.getRecurringTask(t, startTime, endTime);
            recurringTasksBetween.addAll(recurringTasks);
        }

        return recurringTasksBetween;
    }

    /**
     * Get all recurrent tasks of an assignee in [startTime, endTime]
     *
     * @param assignee  the assignee of recurrent task
     * @param startTime the requested range start time
     * @param endTime   the requested range end time
     * @return List<Task> - a list of recurrent tasks within the time range
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getRecurringTaskOfAssignee(String assignee, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> recurringTasks = this.taskRepository.findTasksByAssigneeAndRecurrenceRuleNotNull(assignee);
        return getRecurringTasks(recurringTasks, startTime, endTime);
    }

    /**
     * Get all recurrent tasks in [startTime, endTime]
     *
     * @param startTime the requested range start time
     * @param endTime   the requested range end time
     * @return List<Task> - a list of recurring tasks within the time range
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getAllRemindingRecurringTasksBetween(ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> recurringTasks = this.taskRepository.findTasksByRecurrenceRuleNotNull();
        return getRecurringTasks(recurringTasks, startTime, endTime);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getAllRemindingRecurringTasksByProjectBetween(Project project, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> recurringTasks = this.taskRepository.findTaskByProjectAndRecurrenceRuleNotNull(project);
        return getRecurringTasks(recurringTasks, startTime, endTime);
    }

    /**
     * Get all reminding tasks in [startTime, endTime]
     *
     * @param startTime the requested range start time
     * @param endTime   the requested range end time
     * @return List<Task> - a list of tasks within the time range
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getAllRemindingTasksBetween(ZonedDateTime startTime, ZonedDateTime endTime) {
        Timestamp start = Timestamp.from(startTime.toInstant());
        Timestamp end = Timestamp.from(endTime.toInstant());
        return this.taskRepository.findRemindingTasksBetween(start.toString(), end.toString());
    }

    /**
     * Get all reminder records from given task and put them into target ReminderRecord Map along with given task
     *
     * @param reminderRecordTaskMap the ReminderRecord map
     * @param tasks                 a list of tasks to be added into reminderRecordTaskMap
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void fillReminderRecordTaskMap(Map<ReminderRecord, Task> reminderRecordTaskMap,
                                          List<Task> tasks, ZonedDateTime start, ZonedDateTime end) {
        tasks.forEach(t -> {
            Map<ReminderRecord, Task> records = DaoHelper.getReminderRecordMap(t, start, end);
            for (Map.Entry<ReminderRecord, Task> entry : records.entrySet()) {
                reminderRecordTaskMap.put(entry.getKey(), entry.getValue());
            }
        });
    }

    /**
     * Get all tasks: startTime <= task.startTime <= endTime
     * Both nonrecurring and recurring tasks
     *
     * @param startTime the requested range start time
     * @param endTime   the requested range end time
     * @return Map<ReminderRecord, Task> - a map with
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Map<ReminderRecord, Task> getRemindingTasks(ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> nonRecurringTasks = getAllRemindingTasksBetween(startTime, endTime);
        List<Task> recurringTasks = getAllRemindingRecurringTasksBetween(startTime, endTime);

        Map<ReminderRecord, Task> reminderRecordTaskMap = new HashMap<>(); // TODO: Need to confirm map type
        fillReminderRecordTaskMap(reminderRecordTaskMap, nonRecurringTasks, startTime, endTime);
        fillReminderRecordTaskMap(reminderRecordTaskMap, recurringTasks, startTime, endTime);

        return reminderRecordTaskMap;
    }

    public List<Task> createTaskFromSampleTask(
            Long projectId,
            String owner,
            List<com.bulletjournal.templates.controller.model.SampleTask> sampleTasks,
            List<SampleTask> repoSampleTasks,
            Integer reminderBeforeTask,
            List<String> assignees,
            List<Long> labels
    ) {
        Preconditions.checkNotNull(assignees);

        List<CreateTaskParams> createTaskParams = new ArrayList<>();
        sampleTasks.forEach(sampleTask -> createTaskParams.add(sampleTaskToCreateTaskParams(
                sampleTask,
                reminderBeforeTask,
                assignees,
                labels)
        ));

        List<Task> tasks;
        try {
            tasks = create(projectId, owner, createTaskParams);
        } catch (Exception ex) {
            LOGGER.info("createTaskFromSampleTask failed", ex);
            return Collections.emptyList();
        }
        Preconditions.checkArgument(sampleTasks.size() == tasks.size(),
                sampleTasks.size() + " does not match " + tasks.size());
        List<com.bulletjournal.templates.controller.model.SampleTask> sampleTasksForContents = new ArrayList<>();
        List<Task> tasksForContents = new ArrayList<>();
        for (int i = 0; i < sampleTasks.size(); i++) {
            if (sampleTasks.get(i).isRefreshable()) {
                long sampleTaskId = sampleTasks.get(i).getId();
                tasks.get(i).setSampleTask(
                        repoSampleTasks.stream().filter(s -> sampleTaskId == s.getId()).findFirst().get());
                continue;
            }
            sampleTasksForContents.add(sampleTasks.get(i));
            tasksForContents.add(tasks.get(i));
        }

        this.saveAll(tasks);

        if (!sampleTasksForContents.isEmpty()) {
            this.notificationService.addContentBatch(new ContentBatch(
                    sampleTasksForContents.stream()
                            .map(sampleTask -> new TaskContent(sampleTask.getContent())).collect(Collectors.toList()),
                    tasksForContents,
                    tasksForContents.stream().map(ProjectItemModel::getOwner).collect(Collectors.toList())));
        }

        return tasks;
    }

    /**
     * Create task based on CreateTaskParams
     *
     * @param projectId        the project id
     * @param owner            the owner and assignee of task
     * @param createTaskParams the CreateTaskParams object contains task information
     * @return Task - A repository task model
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task create(Long projectId, String owner, CreateTaskParams createTaskParams) {
        Project project = this.projectDaoJpa.getProject(projectId, owner);
        if (!ProjectType.TODO.equals(ProjectType.getType(project.getType()))) {
            throw new BadRequestException("Project Type expected to be TODO while request is " + project.getType());
        }
        Task task = generateTask(owner, project, createTaskParams);
        return this.taskRepository.saveAndFlush(task);
    }

    public List<Task> create(Long projectId, String owner, List<CreateTaskParams> createTaskParamsList) {
        Project project = this.projectDaoJpa.getProject(projectId, owner);
        if (!ProjectType.TODO.equals(ProjectType.getType(project.getType()))) {
            throw new BadRequestException("Project Type expected to be TODO while request is " + project.getType());
        }
        List<Task> tasks = createTaskParamsList.stream()
                .map(createTaskParams -> generateTask(owner, project, createTaskParams)).collect(Collectors.toList());

        List<Task> batch = new ArrayList<>();
        List<Task> result = new ArrayList<>();
        for (Task task : tasks) {
            batch.add(task);
            if (batch.size() == 200) {
                result.addAll(this.taskRepository.saveAll(batch));
                batch.clear();
                entityManager.flush();
                entityManager.clear();
            }
        }
        if (!batch.isEmpty()) {
            result.addAll(this.taskRepository.saveAll(batch));
            entityManager.flush();
            entityManager.clear();
        }
        return result;
    }

    public static Task generateTask(String owner, Project project, CreateTaskParams createTaskParams) {
        createTaskParams.selfClean();

        Task task = new Task();
        task.setProject(project);
        task.setDueDate(createTaskParams.getDueDate());
        task.setDueTime(createTaskParams.getDueTime());
        task.setOwner(owner);
        task.setName(createTaskParams.getName());
        task.setTimezone(createTaskParams.getTimezone());
        task.setDuration(createTaskParams.getDuration());
        if (createTaskParams.hasDuration() && createTaskParams.getDuration() <= 0) {
            task.setDuration(null);
        }
        task.setAssignees(createTaskParams.getAssignees());
        task.setRecurrenceRule(createTaskParams.getRecurrenceRule());
        if (createTaskParams.getLabels() != null && !createTaskParams.getLabels().isEmpty()) {
            task.setLabels(createTaskParams.getLabels());
        }

        String date = createTaskParams.getDueDate();
        String time = createTaskParams.getDueTime();
        String timezone = createTaskParams.getTimezone();
        ReminderSetting reminderSetting = getReminderSetting(date, task, time, timezone,
                createTaskParams.getRecurrenceRule(), createTaskParams.getReminderSetting());
        task.setReminderSetting(reminderSetting);
        task.setLocation(createTaskParams.getLocation());
        return task;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(Long projectId, String owner, CreateTaskParams createTaskParams, String eventId, String text) {
        // Skip duplicated eventId
        Project project = this.projectDaoJpa.getProject(projectId, owner);
        if (this.taskRepository.findTaskByGoogleCalendarEventIdAndProject(eventId, project).isPresent()) {
            LOGGER.info("Task with eventId {} and project {} already exists", eventId, projectId);
            return;
        }

        Task task = create(projectId, owner, createTaskParams);
        task.setGoogleCalendarEventId(eventId);
        LOGGER.info("Created task {}", task);
        if (StringUtils.isNotBlank(text)) {
            LOGGER.info("Also created task content {}", text);
            addContent(task.getId(), owner, new TaskContent(text));
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteTaskByGoogleEvenId(String eventId, Project project) {
        Optional<Task> task = this.taskRepository.findTaskByGoogleCalendarEventIdAndProject(eventId, project);
        if (!task.isPresent()) {
            LOGGER.info("Task with eventId {} doesn't  exists", eventId);
            return;
        }
        taskRepository.delete(task.get());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Optional<Task> getTaskByGoogleCalendarEventId(String eventId, Project project) {
        return this.taskRepository.findTaskByGoogleCalendarEventIdAndProject(eventId, project);
    }

    private static ReminderSetting getReminderSetting(String dueDate, Task task, String time, String timezone,
                                                      String recurrenceRule, ReminderSetting reminderSetting) {
        if (dueDate != null) {
            task.setStartTime(Timestamp.from(ZonedDateTimeHelper.getStartTime(dueDate, time, timezone).toInstant()));
            task.setEndTime(Timestamp.from(ZonedDateTimeHelper.getEndTime(dueDate, time, timezone).toInstant()));
        } else {
            task.setStartTime(null);
            task.setEndTime(null);
            if (recurrenceRule == null) {
                // set no reminder
                reminderSetting = new ReminderSetting();
            }
        }

        if (reminderSetting == null) {
            reminderSetting = new ReminderSetting();
        }
        return reminderSetting;
    }

    /**
     * Partially update task based on UpdateTaskParams
     *
     * @param requester        the username of action requester
     * @param taskId           the task id
     * @param updateTaskParams the update task param object contains task fields
     *                         update information
     * @return List<Event> - a list of events for users notification
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task partialUpdate(String requester, Long taskId, UpdateTaskParams updateTaskParams,
                              List<UpdateTaskAssigneeEvent> events) {
        updateTaskParams.selfClean();
        Task task = this.getProjectItem(taskId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.UPDATE, taskId, task.getProject().getOwner());

        DaoHelper.updateIfPresent(updateTaskParams.hasName(), updateTaskParams.getName(), task::setName);

        updateAssignees(requester, updateTaskParams, task, events);

        String date = updateTaskParams.getDueDate();
        String time = updateTaskParams.getDueTime();
        String timezone = updateTaskParams.getTimezone();

        task.setDueDate(date);
        task.setDueTime(time);
        task.setRecurrenceRule(updateTaskParams.getRecurrenceRule());

        DaoHelper.updateIfPresent(updateTaskParams.hasTimezone(), timezone, task::setTimezone);
        DaoHelper.updateIfPresent(updateTaskParams.hasDuration(), updateTaskParams.getDuration(), task::setDuration);
        if (updateTaskParams.hasDuration() && updateTaskParams.getDuration() <= 0) {
            task.setDuration(null);
        }

        if (updateTaskParams.hasTimezone()) {
            updateCompletedSlotsWithTimezone(task, timezone);
        }

        ReminderSetting reminderSetting = getReminderSetting(date, task, time, timezone,
                updateTaskParams.getRecurrenceRule(), updateTaskParams.getReminderSetting());
        task.setReminderSetting(reminderSetting);

        if (updateTaskParams.hasLabels()) {
            task.setLabels(updateTaskParams.getLabels());
        }

        if (updateTaskParams.hasLocation()) {
            task.setLocation(updateTaskParams.getLocation());
        }

        return this.taskRepository.save(task);
    }

    /**
     * Update completed slots with target timezone
     *
     * @param task     the target task to be updated
     * @param timezone the timezone
     */
    private void updateCompletedSlotsWithTimezone(Task task, String timezone) {
        List<DateTime> completedSlots = ZonedDateTimeHelper.parseDateTimeList(task.getCompletedSlots());
        StringBuilder sb = new StringBuilder();
        for (DateTime completedSlot : completedSlots) {
            TimeZone convertedTimezone = TimeZone.getTimeZone(timezone);
            DateTime shiftedDateTime = completedSlot.shiftTimeZone(convertedTimezone);
            sb.append(shiftedDateTime.toString());
        }
        task.setCompletedSlots(sb.toString());
    }

    /**
     * Add assignees change event to notification
     *
     * @param requester        the username of action requester
     * @param updateTaskParams the update task param object contains task fields
     *                         update information
     * @param task             the task object gets updated
     * @return List<Event> - a list of events for users notification
     */
    private List<UpdateTaskAssigneeEvent> updateAssignees(String requester, UpdateTaskParams updateTaskParams,
                                                          Task task, List<UpdateTaskAssigneeEvent> events) {
        if (updateTaskParams.getAssignees() == null) {
            return events;
        }
        Set<String> newAssignees = new HashSet<>(updateTaskParams.getAssignees());
        Set<String> oldAssignees = new HashSet<>(task.getAssignees());

        Set<String> assigneesOverlap = new HashSet<>(newAssignees);
        assigneesOverlap.retainAll(oldAssignees);
        String taskName = updateTaskParams.hasName() ? updateTaskParams.getName() : task.getName();
        for (String user : oldAssignees) {
            if (!assigneesOverlap.contains(user) && !Objects.equals(requester, user)) {
                Event event = new Event(user, task.getId(), taskName);
                events.add(new UpdateTaskAssigneeEvent(event, requester, null));
            }
        }
        for (String user : newAssignees) {
            if (!assigneesOverlap.contains(user) && !Objects.equals(requester, user)) {
                Event event = new Event(user, task.getId(), taskName);
                events.add(new UpdateTaskAssigneeEvent(event, requester, user));
            }
        }
        task.setAssignees(updateTaskParams.getAssignees());
        return events;
    }

    /**
     * Set a task to complete
     * <p>
     * 1. Get task from task table 2. Delete task and its sub tasks from task table
     * 3. Add task and its sub tasks to complete task table
     *
     * @param requester the username of action requester
     * @param taskId    the task id
     * @return CompleteTask - a repository model complete task object
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CompletedTask complete(String requester, Long taskId, String dateTime) {

        Task task = this.getProjectItem(taskId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.UPDATE, task.getProject().getId(), task.getProject().getOwner());

        // clone its contents
        String contents = GSON_ALLOW_EXPOSE_ONLY
                .toJson(this.getContents(taskId, requester).stream().collect(Collectors.toList()));

        if (dateTime != null && StringUtils.isNotBlank(task.getRecurrenceRule())) {
            return completeSingleRecurringTask(task, dateTime, contents);
        }

        this.taskRepository.delete(task);
        CompletedTask completedTask = new CompletedTask(task, contents);
        this.completedTaskRepository.save(completedTask);
        return completedTask;
    }

    /**
     * Complete the recurring task of target date time
     *
     * @param task        the recurring task
     * @param dateTimeStr the date time of the task completed
     * @return CompletedTask
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CompletedTask completeSingleRecurringTask(Task task, String dateTimeStr, String contents) {
        Set<String> completedSlotsSet = ZonedDateTimeHelper.parseDateTimeSet(task.getCompletedSlots());
        String timezone = task.getTimezone();
        DateTime dateTime = ZonedDateTimeHelper.getDateTime(ZonedDateTimeHelper.convertDateTime(dateTimeStr, timezone));

        if (completedSlotsSet.contains(dateTime.toString())) {
            throw new IllegalArgumentException("Duplicated task completed");
        }

        // Added target date time to the recurring task's completed slots
        task.setCompletedSlots(task.getCompletedSlots() == null ? dateTime.toString()
                : task.getCompletedSlots() + "," + dateTime.toString());
        this.taskRepository.save(task);

        CompletedTask completedTask = new CompletedTask(task, contents);
        completedTask.setRecurrenceRule(null);
        completedTask.setDueDate(ZonedDateTimeHelper.getDate(dateTime));
        completedTask.setDueTime(ZonedDateTimeHelper.getTime(dateTime));

        this.completedTaskRepository.save(completedTask);
        return completedTask;
    }

    /**
     * Update sub tasks relation
     *
     * @param projectId the project id
     * @param tasks     a list of tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserTasks(
            Long projectId, List<com.bulletjournal.controller.models.Task> tasks, String requester) {
        this.projectDaoJpa.getProject(projectId, requester);
        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        final ProjectTasks projectTasks = projectTasksOptional.orElseGet(ProjectTasks::new);

        projectTasks.setTasks(TaskRelationsProcessor.processRelations(tasks));
        projectTasks.setProjectId(projectId);

        this.projectTasksRepository.save(projectTasks);
    }

    /**
     * Delete requester's task by task identifier
     *
     * @param requester the username of action requester
     * @param taskId    the task id
     * @return List<Event> - a list of notification events
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<List<Event>, Task> deleteTask(String requester, Long taskId) {
        Task task = this.getProjectItem(taskId, requester);
        this.taskRepository.delete(task);
        return Pair.of(generateEvents(task, requester, task.getProject()), task);
    }

    /**
     * Delete completed tasks from database
     * <p>
     * 1. Check if the requester is authorized for the operation 2. Remove task from
     * complete tasks table
     *
     * @param requester the username of action requester
     * @param taskId    the task id
     * @retVal List<Event> - a list of notification events
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> deleteCompletedTask(String requester, Long taskId) {
        CompletedTask task = this.completedTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));
        Project project = task.getProject();
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.DELETE, project.getId(), task.getProject().getOwner());
        this.completedTaskRepository.delete(task);
        return generateEvents(task, requester, project);
    }

    /**
     * Generate events for notification
     *
     * @param task      the task generate the notification event
     * @param requester the username of action requester
     * @param project   the project of the task
     * @retVal List<Event> - a list of notification events
     */
    private List<Event> generateEvents(TaskModel task, String requester, Project project) {
        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : project.getGroup().getAcceptedUsers()) {
            // skip send event to self
            String username = userGroup.getUser().getName();
            if (userGroup.getUser().getName().equals(requester)) {
                continue;
            }
            events.add(new Event(username, task.getId(), task.getName()));
        }
        return events;
    }

    /**
     * Get completed tasks by project from database
     *
     * @param projectId the project id
     * @param requester the username of action requester
     * @retVal List<Completed> - a list of completed tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<CompletedTask> getCompletedTasks(Long projectId, String requester, Integer pageNo, Integer pageSize) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);

        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by("id").descending());

        List<CompletedTask> completedTasks = this.completedTaskRepository.findCompletedTaskByProject(project, paging);
        completedTasks.forEach(t -> t.setLabels(Collections.emptyList()));
        return completedTasks.stream().sorted((c1, c2) -> c2.getUpdatedAt().compareTo(c1.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<CompletedTask> getCompletedTasksBetween(Long projectId, String assignee, String requester,
                                                        String startDate, String endDate, String timezone) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
        ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);

        List<CompletedTask> completedTasks;

        if (StringUtils.isNotBlank(assignee) && !EVERYONE.equals(assignee)) {
            completedTasks = this.completedTaskRepository.findCompletedTaskByAssigneeBetween(projectId, assignee,
                    Timestamp.from(startTime.toInstant()), Timestamp.from(endTime.toInstant()));
        } else {
            completedTasks = this.completedTaskRepository.findCompletedTaskBetween(project,
                    Timestamp.from(startTime.toInstant()), Timestamp.from(endTime.toInstant()));
        }

        completedTasks.forEach(t -> t.setLabels(Collections.emptyList()));
        return completedTasks.stream().sorted((c1, c2) -> c2.getUpdatedAt().compareTo(c1.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    /**
     * Uncomplete completed task.
     * <p>
     * 1. Check if requester is allowed to operate with this action 2. Remove task
     * from Completed Task table 3. Create a new task and add it to regular Task
     * table
     *
     * @param requester the username of action requester
     * @param taskId    the task id
     * @retVal Long - the completed task id
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<Long, CompletedTask> uncomplete(String requester, Long taskId) {
        CompletedTask task = this.completedTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));
        Project project = task.getProject();
        this.authorizationService.validateRequesterInProjectGroup(requester, project);
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.UPDATE, project.getId(), task.getProject().getOwner());
        List<TaskContent> contents = getCompletedTaskContents(taskId, requester);
        this.completedTaskRepository.delete(task);
        Long newId = create(project.getId(), task.getOwner(), getCreateTaskParams(task)).getId();
        Collections.reverse(contents);
        // we order contents by getUpdatedAt in descending order
        for (TaskContent content : contents) {
            this.addContentForUncompleted(newId, content.getOwner(), content);
        }
        return Pair.of(newId, task);
    }

    /**
     * Remove reminder setting from CreateTaskParams
     *
     * @param task the task object to be completed
     * @return CreateTaskParams - a create task parameter object contains completed
     * task creation information
     */
    private CreateTaskParams getCreateTaskParams(CompletedTask task) {
        return new CreateTaskParams(task.getName(), task.getDueDate(), task.getDueTime(), task.getDuration(),
                new ReminderSetting(), task.getAssignees(), task.getTimezone(), task.getRecurrenceRule(),
                Collections.emptyList(), task.getLocation());
    }

    /**
     * Move task from one project to another
     *
     * @param requester     the username of action requester
     * @param taskId        the task id
     * @param targetProject the target project where the task moves to
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<Task, Project> move(String requester, Long taskId, Long targetProject) {
        final Project project = this.projectDaoJpa.getProject(targetProject, requester);

        Task task = this.getProjectItem(taskId, requester);

        if (!Objects.equals(task.getProject().getType(), project.getType())) {
            throw new BadRequestException("Cannot move to Project Type " + project.getType());
        }

        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.UPDATE, project.getId(), project.getOwner());

        task.setProject(project);
        this.taskRepository.save(task);
        return Pair.of(task, project);
    }

    /**
     * Get Content Jpa Repository
     *
     * @return JpaRepository
     */
    @Override
    public JpaRepository<TaskContent, Long> getContentJpaRepository() {
        return this.taskContentRepository;
    }

    @Override
    public <T extends ProjectItemModel> List<TaskContent> findContents(T projectItem) {
        return this.taskContentRepository.findTaskContentByTask((Task) projectItem);
    }

    @Override
    TaskContent newContent(String text) {
        return new TaskContent(text);
    }


    @Override
    public <T extends ProjectItemModel> List<TaskContent> getContents(Long projectItemId, String requester) {
        List<TaskContent> contents = super.getContents(projectItemId, requester);
        Task task = getProjectItem(projectItemId, requester);
        if (task.getSampleTask() != null) {
            String sampleTaskContent = task.getSampleTask().getContent();
            TaskContent taskContent = new TaskContent(sampleTaskContent);
            taskContent.setId(0L);
            taskContent.setProjectItem(task);
            taskContent.setCreatedAt(Timestamp.from(Instant.now()));
            taskContent.setUpdatedAt(Timestamp.from(Instant.now()));
            taskContent.setBaseText(sampleTaskContent);
            taskContent.setOwner(task.getOwner());
            taskContent.setRevisions("");
            contents.add(0, taskContent);
        }
        return contents;
    }

    @Override
    List<Long> findItemLabelsByProject(Project project) {
        return taskRepository.findUniqueLabelsByProject(project.getId());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<TaskContent> getCompletedTaskContents(Long taskId, String requester) {
        CompletedTask task = getCompletedTask(taskId, requester);
        return Arrays.asList(GSON.fromJson(task.getContents(), TaskContent[].class));
    }

    public boolean isTaskModified(Task task, String requester) {
        if (Math.abs(task.getCreatedAt().getTime() - task.getUpdatedAt().getTime()) > 1000) {
            return true;
        }
        List<TaskContent> contents = this.getContents(task.getId(), requester);

        if (null == contents || contents.isEmpty()) {
            return false;
        }
        Timestamp latestContentTime = contents.get(0).getUpdatedAt();

        return latestContentTime.getTime() - task.getUpdatedAt().getTime() > 30000;
    }

    @Override
    List<Task> findRecentProjectItemsBetween(Timestamp startTime, Timestamp endTime, List projects) {
        return this.taskRepository.findTasksBetween(startTime, endTime, projects);
    }

    @Override
    public List<Object[]> findRecentProjectItemContentsBetween(Timestamp startTime, Timestamp endTime, List projectIds) {
        StringBuilder queryBuilder = new StringBuilder(
                "SELECT tasks_join_task_contents.id, tasks_join_task_contents.most_recent_time " +
                        "FROM tasks_join_task_contents " +
                        "WHERE tasks_join_task_contents.most_recent_time >= ? " +
                        "AND tasks_join_task_contents.most_recent_time <= ? " +
                        "AND tasks_join_task_contents.project_id IN (");
        projectIds.stream().forEach(pi -> queryBuilder.append(pi).append(","));
        int tail = queryBuilder.length() - 1;
        if (queryBuilder.charAt(tail) == ',') {
            queryBuilder.deleteCharAt(tail);
        }
        queryBuilder.append(")");

        return entityManager.createNativeQuery(queryBuilder.toString())
                .setParameter(1, startTime)
                .setParameter(2, endTime)
                .getResultList();
    }

    public List<String> getDeleteESDocumentIdsForProjectItem(String requester, Long taskId) {
        List<String> deleteESDocumentIds = new ArrayList<>();
        Task task = this.getProjectItem(taskId, requester);

        deleteESDocumentIds.add(ESUtil.getProjectItemSearchIndexId(task));
        List<TaskContent> taskContents = findContents(task);
        for (TaskContent content : taskContents) {
            deleteESDocumentIds.add(this.searchIndexDaoJpa.getContentSearchIndexId(content));
        }

        return deleteESDocumentIds;
    }

    public List<String> getDeleteESDocumentIdsForContent(String requester, Long contentId) {
        List<String> deleteESDocumentIds = new ArrayList<>();
        TaskContent content = this.getContent(contentId, requester);
        deleteESDocumentIds.add(this.searchIndexDaoJpa.getContentSearchIndexId(content));

        return deleteESDocumentIds;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<CompletedTask> getCompletedTaskByProjectIdInTimePeriod(List<Long> projectIds, String startDate, String endDate, String timezone) {
        if (!StringUtils.isBlank(startDate) && !StringUtils.isBlank(endDate)) {
            String startTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getStartTime(startDate, null, timezone));
            String endTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getEndTime(endDate, null, timezone));
            return completedTaskRepository.findCompletedTaskWithProjectIdStartTimeEndTime(projectIds, startTime, endTime);
        } else if (!StringUtils.isBlank(startDate)) {
            String startTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getStartTime(startDate, null, timezone));
            return completedTaskRepository.findCompletedTaskWithProjectIdStartTime(projectIds, startTime);
        } else if (!StringUtils.isBlank(endDate)) {
            String endTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getEndTime(endDate, null, timezone));
            return completedTaskRepository.findCompletedTaskWithProjectIdEndTime(projectIds, endTime);
        } else {
            return completedTaskRepository.findCompletedTaskWithProjectId(projectIds);
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getUncompletedTasksByProjectIdInTimePeriod(List<Long> projectIds, String startDate, String endDate, String timezone) {
        if (!StringUtils.isBlank(startDate) && !StringUtils.isBlank(endDate)) {
            String startTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getStartTime(startDate, null, timezone));
            String endTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getEndTime(endDate, null, timezone));
            return taskRepository.findTaskWithProjectIdStartTimeEndTime(projectIds, startTime, endTime);
        } else if (!StringUtils.isBlank(startDate)) {
            String startTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getStartTime(startDate, null, timezone));
            return taskRepository.findTaskWithProjectIdStartTime(projectIds, startTime);
        } else if (!StringUtils.isBlank(endDate)) {
            String endTime = ZonedDateTimeHelper.toDBTimestamp(ZonedDateTimeHelper.getEndTime(endDate, null, timezone));
            return taskRepository.findTaskWithProjectIdEndTime(projectIds, endTime);
        } else {
            return taskRepository.findTaskWithProjectId(projectIds);
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void saveAll(List<Task> tasks) {
        this.taskRepository.saveAll(tasks);
    }

    private CreateTaskParams sampleTaskToCreateTaskParams(
            com.bulletjournal.templates.controller.model.SampleTask sampleTask,
            Integer reminderBeforeTask,
            List<String> assignees,
            List<Long> labels
    ) {
        return new CreateTaskParams(
                sampleTask.getName(),
                sampleTask.getDueDate(),
                sampleTask.getDueTime(),
                60,
                reminderBeforeTask == null ? null : new ReminderSetting(null, null, reminderBeforeTask),
                assignees,
                sampleTask.getTimeZone(),
                null,
                labels
        );
    }
}