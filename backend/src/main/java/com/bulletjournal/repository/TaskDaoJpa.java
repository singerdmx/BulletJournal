package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.UpdateTaskParams;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.TaskRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.UpdateTaskAssigneeEvent;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.bulletjournal.util.BuJoRecurrenceRule;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Repository
public class TaskDaoJpa extends ProjectItemDaoJpa<TaskContent> {
    private static final String EVERYONE = "Everyone";
    private static final Logger LOGGER = LoggerFactory.getLogger(TaskDaoJpa.class);
    private static final Gson GSON = new Gson();
    private static final int REMINDING_TASK_BUFFER_IN_MINS = 10;

    private static final Gson GSON_ALLOW_EXPOSE_ONLY = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
            .create();

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
    private UserAliasDaoJpa userAliasDaoJpa;

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
    public List<com.bulletjournal.controller.models.Task> getTasks(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        if (project.isShared()) {
            return this.sharedProjectItemDaoJpa.getSharedProjectItems(requester, ProjectType.TODO);
        }

        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        if (!projectTasksOptional.isPresent()) {
            return Collections.emptyList();
        }
        ProjectTasks projectTasks = projectTasksOptional.get();
        final Map<Long, Task> tasksMap = this.taskRepository.findTaskByProject(project).stream()
                .collect(Collectors.toMap(Task::getId, n -> n));
        return TaskRelationsProcessor
                .processRelations(tasksMap, projectTasks.getTasks(), this.userAliasDaoJpa.getAliases(requester))
                .stream().map(task -> addLabels(task, tasksMap)).collect(Collectors.toList());
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
            return t.toPresentationModel(labels, this.userAliasDaoJpa.getAliases(requester));
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getTasksByOrder(Long projectId, String requester,
                                                                          String startDate, String endDate, String timezone) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        if (project.isShared()) {
            return Collections.emptyList();
        }

        List<Task> tasks = Collections.emptyList();
        if (StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate)) {
            tasks = this.taskRepository.findTaskByProject(project);
        } else {
            // Set start time and end time
            ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
            ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);
            tasks = this.taskRepository.findTasksBetween(project, Timestamp.from(startTime.toInstant()),
                    Timestamp.from(endTime.toInstant()));
        }

        tasks.sort(ProjectItemsGrouper.TASK_COMPARATOR);
        return tasks.stream().map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            return t.toPresentationModel(labels, this.userAliasDaoJpa.getAliases(requester));
        }).collect(Collectors.toList());
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
        return task.toPresentationModel(labels, this.userAliasDaoJpa.getAliases(requester));
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
        return task;
    }

    /**
     * Get assignee's reminding tasks and recurring reminding tasks from database.
     * <p>
     * Reminding tasks qualifications: 1. Reminding Time is before current time. 2.
     * Starting time plus 10 minutes buffer is after the current time.
     * <p>
     * [Reminding Time] <= Now <= [Starting Time + 10 mins]
     *
     * @param assignee the username of task assignee
     * @param now      the ZonedDateTime object of the current time
     * @return List<com.bulletjournal.controller.models.Task> - a list of tasks to
     * be reminded
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getRemindingTasks(String assignee, ZonedDateTime now) {
        Timestamp currentTime = Timestamp.from(now.toInstant());
        // Subtract current time by 10 minutes to compare with task's starting time
        Timestamp startTime = Timestamp.from(now.minusMinutes(REMINDING_TASK_BUFFER_IN_MINS).toInstant());

        // Fetch regular reminding tasks
        List<com.bulletjournal.controller.models.Task> regularTasks = this.taskRepository
                .findRemindingTasks(assignee, currentTime.toString(), startTime.toString()).stream()
                .map(TaskModel::toPresentationModel).collect(Collectors.toList());

        // Fetch recurring reminding tasks
        List<com.bulletjournal.controller.models.Task> recurringTask = getRecurringTaskNeedReminding(assignee, now);

        // Append recurring reminding tasks to regular reminding tasks
        regularTasks.addAll(recurringTask);
        return regularTasks;
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
    public List<Task> getTasksBetween(String assignee, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> tasks = this.taskRepository.findTasksOfAssigneeBetween(assignee,
                ZonedDateTimeHelper.toDBTimestamp(startTime), ZonedDateTimeHelper.toDBTimestamp(endTime));

        List<Task> recurrentTasks = this.getRecurringTasks(assignee, startTime, endTime);

        tasks.addAll(recurrentTasks);
        return tasks;
    }

    /**
     * Get recurring reminding tasks from database.
     * <p>
     * Reminding tasks qualifications: 1. Reminding Time is before current time. 2.
     * Starting time is after the current time.
     *
     * @param assignee the username of task assignee
     * @param now      the ZonedDateTime object of the current time
     * @return List<com.bulletjournal.controller.models.Task> - a list of tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getRecurringTaskNeedReminding(final String assignee,
                                                                                        final ZonedDateTime now) {
        ZonedDateTime maxRemindingTime = now.plusHours(ZonedDateTimeHelper.MAX_HOURS_BEFORE);
        return this.getRecurringTasks(assignee, now, maxRemindingTime).stream()
                .filter(t -> t.getReminderDateTime().before(ZonedDateTimeHelper.getTimestamp(now))
                        && t.getStartTime().after(ZonedDateTimeHelper.getTimestamp(now)))
                .map(TaskModel::toPresentationModel).collect(Collectors.toList());
    }

    /**
     * Get all recurrent tasks of an assignee within requested start time and end
     * time
     * <p>
     * Procedure: 1. Fetch all tasks with recurrence rule 2. Obtain new DateTime
     * instance by using RecurrenceRule iterator 3. Clone the original recurring
     * task and set its start/end time and reminding setting
     *
     * @param assignee  the username of task assignee
     * @param startTime the ZonedDateTime object of start time
     * @param endTime   the ZonedDateTime object of end time
     * @return List<Task> - a list of recurrent tasks within the time range
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getRecurringTasks(String assignee, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> recurringTasksBetween = new ArrayList<>();
        List<Task> recurrentTasks = this.taskRepository.findTasksByAssigneeAndRecurrenceRuleNotNull(assignee);
        DateTime startDateTime = ZonedDateTimeHelper.getDateTime(startTime);
        DateTime endDateTime = ZonedDateTimeHelper.getDateTime(endTime);

        for (Task t : recurrentTasks) {
            try {
                String recurrenceRule = t.getRecurrenceRule();
                String timezone = t.getTimezone();
                Set<String> completedSlots = ZonedDateTimeHelper.parseDateTimeSet(t.getCompletedSlots());
                BuJoRecurrenceRule rule = new BuJoRecurrenceRule(recurrenceRule, timezone);
                RecurrenceRuleIterator it = rule.getIterator();
                while (it.hasNext()) {
                    DateTime currDateTime = it.nextDateTime();
                    if (currDateTime.after(endDateTime)) {
                        break;
                    }
                    if (currDateTime.before(startDateTime) || completedSlots.contains(currDateTime.toString())) {
                        continue;
                    }
                    Task cloned = (Task) t.clone();

                    String date = ZonedDateTimeHelper.getDate(currDateTime);
                    String time = ZonedDateTimeHelper.getTime(currDateTime);

                    cloned.setDueDate(date); // Set due date
                    cloned.setDueTime(time); // Set due time

                    // Set start time and end time
                    cloned.setStartTime(
                            Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()));
                    cloned.setEndTime(Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()));

                    cloned.setReminderSetting(t.getReminderSetting()); // Set reminding setting to cloned
                    recurringTasksBetween.add(cloned);
                }
            } catch (InvalidRecurrenceRuleException | NumberFormatException e) {
                throw new IllegalArgumentException("Recurrence rule format invalid");
            } catch (CloneNotSupportedException e) {
                throw new IllegalStateException("Clone new Task failed");
            }
        }
        return recurringTasksBetween;
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
    public Pair<Task, Project> create(Long projectId, String owner, CreateTaskParams createTaskParams) {

        Project project = this.projectDaoJpa.getProject(projectId, owner);
        if (!ProjectType.TODO.equals(ProjectType.getType(project.getType()))) {
            throw new BadRequestException("Project Type expected to be TODO while request is " + project.getType());
        }

        Task task = new Task();
        task.setProject(project);
        task.setDueDate(createTaskParams.getDueDate());
        task.setDueTime(createTaskParams.getDueTime());
        task.setOwner(owner);
        task.setName(createTaskParams.getName());
        task.setTimezone(createTaskParams.getTimezone());
        task.setDuration(createTaskParams.getDuration());
        task.setAssignees(createTaskParams.getAssignees());
        task.setRecurrenceRule(createTaskParams.getRecurrenceRule());

        String date = createTaskParams.getDueDate();
        String time = createTaskParams.getDueTime();
        String timezone = createTaskParams.getTimezone();
        ReminderSetting reminderSetting = getReminderSetting(date, task, time, timezone,
                createTaskParams.getRecurrenceRule(), createTaskParams.getReminderSetting());
        task.setReminderSetting(reminderSetting);
        task = this.taskRepository.save(task);

        final ProjectTasks projectTasks = this.projectTasksRepository.findById(projectId).orElseGet(ProjectTasks::new);

        String newRelations = HierarchyProcessor.addItem(projectTasks.getTasks(), task.getId());
        projectTasks.setProjectId(projectId);
        projectTasks.setTasks(newRelations);
        this.projectTasksRepository.save(projectTasks);
        return Pair.of(task, project);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(Long projectId, String owner, CreateTaskParams createTaskParams, String eventId, String text) {
        // Skip duplicated eventId
        if (this.taskRepository.findTaskByGoogleCalendarEventId(eventId).isPresent()) {
            LOGGER.info("Task with eventId {} already exists", eventId);
            return;
        }

        Task task = create(projectId, owner, createTaskParams).getLeft();
        task.setGoogleCalendarEventId(eventId);
        task = this.taskRepository.save(task);
        LOGGER.info("Created task {}", task);
        if (StringUtils.isNotBlank(text)) {
            LOGGER.info("Also created task content {}", text);
            addContent(task.getId(), owner, new TaskContent(text));
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteTaskByGoogleEvenId(String eventId) {
        Optional<Task> task = this.taskRepository.findTaskByGoogleCalendarEventId(eventId);
        if (!task.isPresent()) {
            LOGGER.info("Task with eventId {} doesn't  exists", eventId);
            return;
        }
        taskRepository.delete(task.get());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Optional<Task> getTaskByGoogleCalendarEventId(String eventId) {
        return this.taskRepository.findTaskByGoogleCalendarEventId(eventId);
    }

    private ReminderSetting getReminderSetting(String dueDate, Task task, String time, String timezone,
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

        Task task = this.getProjectItem(taskId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.UPDATE, taskId, task.getProject().getOwner());

        DaoHelper.updateIfPresent(updateTaskParams.hasName(), updateTaskParams.getName(), task::setName);

        updateAssignees(requester, updateTaskParams, task, events);

        String date = updateTaskParams.getDueDate();
        String time = updateTaskParams.getDueTime();
        String timezone = updateTaskParams.getTimezone();

        DaoHelper.updateIfPresent(updateTaskParams.hasDueDate(), date, task::setDueDate);
        DaoHelper.updateIfPresent(updateTaskParams.hasDueTime(), time, task::setDueTime);
        DaoHelper.updateIfPresent(updateTaskParams.hasTimezone(), timezone, task::setTimezone);
        DaoHelper.updateIfPresent(updateTaskParams.hasRecurrenceRule(), updateTaskParams.getRecurrenceRule(),
                task::setRecurrenceRule);
        DaoHelper.updateIfPresent(updateTaskParams.hasDuration(), updateTaskParams.getDuration(), task::setDuration);

        if (updateTaskParams.hasTimezone()) {
            updateCompletedSlotsWithTimezone(task, timezone);
        }

        ReminderSetting reminderSetting = getReminderSetting(date, task, time, timezone,
                updateTaskParams.getRecurrenceRule(), updateTaskParams.getReminderSetting());
        task.setReminderSetting(reminderSetting);
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
        String taskName = updateTaskParams.getName() == null ? task.getName() : updateTaskParams.getName();
        for (String user : oldAssignees) {
            if (!assigneesOverlap.contains(user)) {
                Event event = new Event(user, task.getId(), taskName);
                events.add(new UpdateTaskAssigneeEvent(event, requester, null));

            }
        }
        for (String user : newAssignees) {
            if (!assigneesOverlap.contains(user)) {
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

        deleteTaskAndAdjustRelations(requester, task, (targetTasks) -> {
            targetTasks.forEach(t -> {
                if (!t.getId().equals(task.getId())) {
                    this.completedTaskRepository
                            .save(new CompletedTask(t, GSON_ALLOW_EXPOSE_ONLY.toJson(this.taskContentRepository
                                    .findTaskContentByTask(t).stream().collect(Collectors.toList()))));
                }
            });
            this.taskRepository.deleteAll(targetTasks);
        }, (target) -> {
        });

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
    public void updateUserTasks(Long projectId, List<com.bulletjournal.controller.models.Task> tasks) {
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

        Project project = deleteTaskAndAdjustRelations(requester, task,
                (targetTasks) -> this.taskRepository.deleteAll(targetTasks), (target) -> {
                });

        return Pair.of(generateEvents(task, requester, project), task);
    }

    /**
     * Delete task and adjust project relations after task completion
     *
     * @param requester           the username of action requester
     * @param task                the task object gets deleted
     * @param targetTasksOperator Consumer class or Lambda function operates upon
     *                            target tasks list
     * @param targetOperator      Consumer class or Lambda function operates upon
     *                            target HierarchyItem
     * @retVal Project
     */
    private Project deleteTaskAndAdjustRelations(String requester, Task task, Consumer<List<Task>> targetTasksOperator,
                                                 Consumer<HierarchyItem> targetOperator) {
        Project project = task.getProject();
        Long projectId = project.getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.DELETE, projectId, project.getOwner());

        ProjectTasks projectTasks = this.projectTasksRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectTasks by " + projectId + " not found"));

        String relations = projectTasks.getTasks();

        // delete tasks and its subTasks
        List<Task> targetTasks = this.taskRepository
                .findAllById(HierarchyProcessor.getSubItems(relations, task.getId()));
        targetTasksOperator.accept(targetTasks);

        // Update task relations
        HierarchyItem[] target = new HierarchyItem[1];
        List<HierarchyItem> hierarchy = HierarchyProcessor.removeTargetItem(relations, task.getId(), target);
        targetOperator.accept(target[0]);

        projectTasks.setTasks(GSON.toJson(hierarchy));
        this.projectTasksRepository.save(projectTasks);

        return project;
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
        Long newId = create(project.getId(), task.getOwner(), getCreateTaskParams(task)).getLeft().getId();
        Collections.reverse(contents);
        // we order contents by getUpdatedAt in descending order
        for (TaskContent content : contents) {
            this.addContent(newId, content.getOwner(), content);
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
                new ReminderSetting(), task.getAssignees(), task.getTimezone(), task.getRecurrenceRule());
    }

    /**
     * Move task from one project to another
     *
     * @param requester     the username of action requester
     * @param taskId        the task id
     * @param targetProject the target project where the task moves to
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void move(String requester, Long taskId, Long targetProject) {
        final Project project = this.projectDaoJpa.getProject(targetProject, requester);

        Task task = this.getProjectItem(taskId, requester);

        if (!Objects.equals(task.getProject().getType(), project.getType())) {
            throw new BadRequestException("Cannot move to Project Type " + project.getType());
        }

        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.UPDATE, project.getId(), project.getOwner());

        deleteTaskAndAdjustRelations(requester, task, (targetTasks) -> targetTasks.forEach((t) -> {
            t.setProject(project);
            this.taskRepository.save(t);
        }), (target) -> {
            final ProjectTasks projectTasks = this.projectTasksRepository.findById(targetProject)
                    .orElseGet(ProjectTasks::new);
            String newRelations = HierarchyProcessor.addItem(projectTasks.getTasks(), target);
            projectTasks.setTasks(newRelations);
            projectTasks.setProjectId(targetProject);
            this.projectTasksRepository.save(projectTasks);
        });
    }

    /**
     * Get Content Jpa Repository
     *
     * @return JpaRepository
     */
    @Override
    public JpaRepository getContentJpaRepository() {
        return this.taskContentRepository;
    }

    @Override
    public <T extends ProjectItemModel> List<TaskContent> findContents(T projectItem) {
        return this.taskContentRepository.findTaskContentByTask((Task) projectItem);
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getRecentTasksBetween(Timestamp startTime, Timestamp endTime) {
        Map<Long, Task> taskIdMap = new HashMap<>();
        List<Task> tasks = this.taskRepository.findRecentTasksBetween(startTime, endTime);
        tasks.stream().forEach(task -> taskIdMap.put(task.getId(), task));
        this.taskContentRepository.findRecentTaskContentsBetween(startTime, endTime)
                .stream()
                .forEach(taskContent -> {
                    if (taskIdMap.containsKey(taskContent.getTask().getId())) {
                        Task task = taskIdMap.get(taskContent.getTask().getId());
                        task.setUpdatedAt(
                                task.getUpdatedAt().compareTo(taskContent.getUpdatedAt()) > 0
                                        ? task.getUpdatedAt()
                                        : taskContent.getUpdatedAt()
                        );
                    } else {
                        taskIdMap.put(taskContent.getId(), taskContent.getTask());
                    }
                });
        return taskIdMap.values().stream().collect(Collectors.toList());
    }
}
