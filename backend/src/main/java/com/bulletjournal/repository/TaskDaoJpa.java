package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.UpdateTaskParams;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.TaskRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.bulletjournal.util.BuJoRecurrenceRule;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;
import org.springframework.beans.factory.annotation.Autowired;
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

    private static final Gson GSON = new Gson();

    private static final Gson GSON_ALLOW_EXPOSE_ONLY = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

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
    private UserDaoJpa userDaoJpa;

    @Autowired
    private TaskContentRepository taskContentRepository;

    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;

    @Override
    public JpaRepository getJpaRepository() {
        return this.taskRepository;
    }

    /**
     * Get all tasks from project
     *
     * @param projectId the project identifier
     * @param requester the username of action requester
     * @return List<com.bulletjournal.controller.models.Task> - a list of controller model tasks with labels
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
        final Map<Long, Task> tasksMap = this.taskRepository.findTaskByProject(project)
                .stream().collect(Collectors.toMap(Task::getId, n -> n));
        return TaskRelationsProcessor.processRelations(tasksMap, projectTasks.getTasks())
                .stream()
                .map(task -> addLabels(task, tasksMap))
                .collect(Collectors.toList());
    }

    /**
     * Apply labels to tasks
     *
     * @param task     the task object
     * @param tasksMap the Map object mapping relationship between TaskId and Task Instance
     * @return com.bulletjournal.controller.models.Task - task instance with labels
     */
    private com.bulletjournal.controller.models.Task addLabels(
            com.bulletjournal.controller.models.Task task, Map<Long, Task> tasksMap) {
        List<com.bulletjournal.controller.models.Label> labels =
                getLabelsToProjectItem(tasksMap.get(task.getId()));
        task.setLabels(labels);
        for (com.bulletjournal.controller.models.Task subTask : task.getSubTasks()) {
            addLabels(subTask, tasksMap);
        }
        return task;
    }

    /**
     * Get completed task by task identifier
     * <p>
     * 1. Get task from database
     * 2. Look up task labels and add to task
     *
     * @param requester the username of action requester
     * @param id        the task identifier
     * @return com.bulletjournal.controller.models.Task - controller model task with label
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
     * @return List<com.bulletjournal.controller.models.Task> - a list of completed tasks
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
     * Reminding tasks qualifications:
     * 1. Reminding Time is before current time.
     * 2. Starting time is after the current time.
     *
     * @param assignee the username of task assignee
     * @param now      the ZonedDateTime object of the current time
     * @return List<com.bulletjournal.controller.models.Task> - a list of tasks to be reminded
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getRemindingTasks(String assignee, ZonedDateTime now) {
        Timestamp currentTime = Timestamp.from(now.toInstant());

        // Fetch regular reminding tasks
        List<com.bulletjournal.controller.models.Task> regularTasks = this.taskRepository
                .findRemindingTasks(assignee, currentTime)
                .stream()
                .map(TaskModel::toPresentationModel)
                .collect(Collectors.toList());

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

        List<Task> tasks = this.taskRepository.findTasksOfAssigneeBetween(
                assignee, Timestamp.from(startTime.toInstant()), Timestamp.from(endTime.toInstant()));

        List<Task> recurrentTasks = this.getRecurringTasks(assignee, startTime, endTime);

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
    public List<com.bulletjournal.controller.models.Task> getRecurringTaskNeedReminding(String assignee, ZonedDateTime now) {
        ZonedDateTime maxRemindingTime = now.plusHours(ZonedDateTimeHelper.MAX_HOURS_BEFORE);
        return this.getRecurringTasks(assignee, now, maxRemindingTime)
                .stream()
                .filter(t -> t.getReminderDateTime().before(ZonedDateTimeHelper.getTimestamp(now))
                        && t.getStartTime().after(ZonedDateTimeHelper.getTimestamp(now)))
                .map(TaskModel::toPresentationModel)
                .collect(Collectors.toList());
    }

    /**
     * Get all recurrent tasks of an assignee within requested start time and end time
     * <p>
     * Procedure:
     * 1. Fetch all tasks with recurrence rule
     * 2. Obtain new DateTime instance by using RecurrenceRule iterator
     * 3. Clone the original recurring task and set its start/end time and reminding setting
     *
     * @param assignee  the username of task assignee
     * @param startTime the ZonedDateTime object of start time
     * @param endTime   the ZonedDateTime object of end time
     * @return List<Task> - a list of recurrent tasks within the time range
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getRecurringTasks(String assignee, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> recurringTasksBetween = new ArrayList<>();
        List<Task> recurrentTasks = this.taskRepository.findTasksByAssignedToAndRecurrenceRuleNotNull(assignee);
        DateTime startDateTime = ZonedDateTimeHelper.getDateTime(startTime);
        DateTime endDateTime = ZonedDateTimeHelper.getDateTime(endTime);

        for (Task t : recurrentTasks) {
            try {
                String recurrenceRule = t.getRecurrenceRule();
                String timezone = t.getTimezone();
                Set<DateTime> completedSlots = ZonedDateTimeHelper.parseDateTimeSet(t.getCompletedSlots());
                BuJoRecurrenceRule rule = new BuJoRecurrenceRule(recurrenceRule, timezone);
                RecurrenceRuleIterator it = rule.getIterator();
                while (it.hasNext()) {
                    DateTime currDateTime = it.nextDateTime();
                    if (currDateTime.after(endDateTime)) {
                        break;
                    }
                    if (currDateTime.before(startDateTime) || completedSlots.contains(currDateTime)) {
                        continue;
                    }
                    Task cloned = (Task) t.clone();

                    String date = ZonedDateTimeHelper.getDate(currDateTime);
                    String time = ZonedDateTimeHelper.getTime(currDateTime);

                    cloned.setDueDate(date); // Set due date
                    cloned.setDueTime(time); // Set due time

                    // Set start time and end time
                    cloned.setStartTime(Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()));
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
    public Task create(Long projectId, String owner, CreateTaskParams createTaskParams) {

        Project project = this.projectDaoJpa.getProject(projectId, owner);
        if (!ProjectType.TODO.equals(ProjectType.getType(project.getType()))) {
            throw new BadRequestException("Project Type expected to be TODO while request is " + project.getType());
        }

        Task task = new Task();
        task.setProject(project);
        task.setAssignedTo(owner);
        task.setDueDate(createTaskParams.getDueDate());
        task.setDueTime(createTaskParams.getDueTime());
        task.setOwner(owner);
        task.setName(createTaskParams.getName());
        task.setTimezone(createTaskParams.getTimezone());
        task.setDuration(createTaskParams.getDuration());
        task.setAssignedTo(createTaskParams.getAssignedTo());
        task.setRecurrenceRule(createTaskParams.getRecurrenceRule());

        String date = createTaskParams.getDueDate();
        String time = createTaskParams.getDueTime();
        String timezone = createTaskParams.getTimezone();

        if (date != null) {
            task.setStartTime(Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()));
            task.setEndTime(Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()));
        }

        ReminderSetting reminderSetting = createTaskParams.getReminderSetting();

        if (reminderSetting == null) {
            reminderSetting = new ReminderSetting(null, null,
                    this.userDaoJpa.getByName(owner).getReminderBeforeTask().getValue());
        }
        task.setReminderSetting(reminderSetting);

        task = this.taskRepository.save(task);

        final ProjectTasks projectTasks = this.projectTasksRepository.findById(projectId).orElseGet(ProjectTasks::new);

        String newRelations = HierarchyProcessor.addItem(projectTasks.getTasks(), task.getId());
        projectTasks.setProjectId(projectId);
        projectTasks.setTasks(newRelations);
        this.projectTasksRepository.save(projectTasks);
        return task;
    }

    /**
     * Partially update task based on UpdateTaskParams
     *
     * @param requester        the username of action requester
     * @param taskId           the task id
     * @param updateTaskParams the update task param object contains task fields update information
     * @return List<Event> - a list of events for users notification
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task partialUpdate(String requester, Long taskId, UpdateTaskParams updateTaskParams, List<Event> events) {

        Task task = this.getProjectItem(taskId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(
                task.getOwner(), requester, ContentType.TASK, Operation.UPDATE,
                taskId, task.getProject().getOwner());

        DaoHelper.updateIfPresent(
                updateTaskParams.hasName(), updateTaskParams.getName(), task::setName);

        updateAssignee(requester, taskId, updateTaskParams, task, events);

        String date = updateTaskParams.getDueDate();
        String time = updateTaskParams.getDueTime();
        String timezone = updateTaskParams.getTimezone();

        DaoHelper.updateIfPresent(updateTaskParams.hasDueDate(), date, task::setDueDate);
        DaoHelper.updateIfPresent(updateTaskParams.hasDueTime(), time, task::setDueTime);
        DaoHelper.updateIfPresent(updateTaskParams.hasTimezone(), timezone, task::setTimezone);
        DaoHelper.updateIfPresent(updateTaskParams.hasRecurrenceRule(), updateTaskParams.getRecurrenceRule(), task::setRecurrenceRule);
        DaoHelper.updateIfPresent(updateTaskParams.hasDuration(), updateTaskParams.getDuration(), task::setDuration);

        if (updateTaskParams.hasTimezone()) {
            updateCompletedSlotsWithTimezone(task, timezone);
        }

        if (updateTaskParams.hasDueDate()) {
            task.setStartTime(Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()));
            task.setEndTime(Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()));
        } else {
            task.setStartTime(null);
            task.setEndTime(null);
            if (!updateTaskParams.hasRecurrenceRule()) {
                //  set no reminder
                updateTaskParams.setReminderSetting(new ReminderSetting());
            }
        }

        DaoHelper.updateIfPresent(updateTaskParams.hasReminderSetting(), updateTaskParams.getReminderSetting(),
                task::setReminderSetting);

        return this.taskRepository.save(task);
    }

    /**
     * @param task     the target task to be updated
     * @param timezone the timezone
     * @return Task
     */
    private Task updateCompletedSlotsWithTimezone(Task task, String timezone) {
        List<DateTime> completedSlots = ZonedDateTimeHelper.parseDateTimeList(task.getCompletedSlots());
        StringBuilder sb = new StringBuilder();
        for (DateTime completedSlot : completedSlots) {
            TimeZone convertedTimezone = TimeZone.getTimeZone(timezone);
            DateTime shiftedDateTime = completedSlot.shiftTimeZone(convertedTimezone);
            sb.append(shiftedDateTime.toString());
        }
        task.setCompletedSlots(sb.toString());
        return task;
    }

    /**
     * Add assignee change event to notification
     *
     * @param requester        the username of action requester
     * @param taskId           the task id
     * @param updateTaskParams the update task param object contains task fields update information
     * @param task             the task object gets updated
     * @return List<Event> - a list of events for users notification
     */
    private List<Event> updateAssignee(String requester, Long taskId, UpdateTaskParams updateTaskParams,
                                       Task task, List<Event> events) {
        String newAssignee = updateTaskParams.getAssignedTo();
        String oldAssignee = task.getAssignedTo();
        if (newAssignee != null && !Objects.equals(newAssignee, oldAssignee)) {
            task.setAssignedTo(newAssignee);
            if (!Objects.equals(newAssignee, requester)) {
                events.add(new Event(newAssignee, taskId, task.getName()));
            }
            if (!Objects.equals(oldAssignee, requester)) {
                events.add(new Event(oldAssignee, taskId, task.getName()));
            }
        }
        return events;
    }

    /**
     * Set a task to complete
     * <p>
     * 1. Get task from task table
     * 2. Delete task and its sub tasks from task table
     * 3. Add task and its sub tasks to complete task table
     *
     * @param requester the username of action requester
     * @param taskId    the task id
     * @return CompleteTask - a repository model complete task object
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CompletedTask complete(String requester, Long taskId, String dateTime) {

        Task task = this.getProjectItem(taskId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(),
                requester, ContentType.TASK,
                Operation.UPDATE, task.getProject().getId(), task.getProject().getOwner());

        if (dateTime != null) {
            return completeSingleRecurringTask(task, dateTime);
        }

        // clone its contents
        String contents = GSON_ALLOW_EXPOSE_ONLY.toJson(this.taskContentRepository.findTaskContentByTask(task)
                .stream().collect(Collectors.toList()));

        deleteTaskAndAdjustRelations(
                requester, task,
                (targetTasks) -> {
                    targetTasks.forEach(t -> {
                        if (!t.getId().equals(task.getId())) {
                            this.completedTaskRepository.save(new CompletedTask(t));
                        }
                    });
                    this.taskRepository.deleteAll(targetTasks);
                },
                (target) -> {
                });

        CompletedTask completedTask = new CompletedTask(task);
        completedTask.setContents(contents);
        this.completedTaskRepository.save(completedTask);
        return completedTask;
    }

    /**
     * Complete the recurring task of target date time
     *
     * @param task     the recurring task
     * @param dateTime the date time of the task completed
     * @return CompletedTask
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CompletedTask completeSingleRecurringTask(Task task, String dateTimeStr) {
        Set<DateTime> completedSlotsSet = ZonedDateTimeHelper.parseDateTimeSet(task.getCompletedSlots());
        String timezone = task.getTimezone();
        DateTime dateTime = ZonedDateTimeHelper.getDateTime(ZonedDateTimeHelper.convertDateTime(dateTimeStr, timezone));

        if (completedSlotsSet.contains(dateTime)) {
            throw new IllegalArgumentException("Duplicated task completed");
        }

        // Added target date time to the recurring task's completed slots
        task.setCompletedSlots(task.getCompletedSlots() == null ?
                dateTime.toString() : task.getCompletedSlots() + "," + dateTime.toString());
        this.taskRepository.save(task);

        CompletedTask completedTask = new CompletedTask(task);
        completedTask.setDueDate(ZonedDateTimeHelper.getDate(dateTime));
        completedTask.setDueTime(ZonedDateTimeHelper.getTime(dateTime));

        // clone its contents
        String contents = GSON_ALLOW_EXPOSE_ONLY.toJson(this.taskContentRepository.findTaskContentByTask(task)
                .stream().collect(Collectors.toList()));
        completedTask.setContents(contents);

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
    public List<Event> deleteTask(String requester, Long taskId) {
        Task task = this.getProjectItem(taskId, requester);
        Project project = deleteTaskAndAdjustRelations(
                requester, task,
                (targetTasks) -> this.taskRepository.deleteAll(targetTasks),
                (target) -> {
                });

        return generateEvents(task, requester, project);
    }

    /**
     * Delete task and adjust project relations after task completion
     *
     * @param requester           the username of action requester
     * @param task                the task object gets deleted
     * @param targetTasksOperator Consumer class or Lambda function operates upon target tasks list
     * @param targetOperator      Consumer class or Lambda function operates upon target HierarchyItem
     * @retVal Project
     */
    private Project deleteTaskAndAdjustRelations(
            String requester, Task task,
            Consumer<List<Task>> targetTasksOperator,
            Consumer<HierarchyItem> targetOperator) {
        Project project = task.getProject();
        Long projectId = project.getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.TASK,
                Operation.DELETE, projectId, project.getOwner());

        ProjectTasks projectTasks = this.projectTasksRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectTasks by " + projectId + " not found"));

        String relations = projectTasks.getTasks();

        // delete tasks and its subTasks
        List<Task> targetTasks = this.taskRepository.findAllById(
                HierarchyProcessor.getSubItems(relations, task.getId()));
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
     * 1. Check if the requester is authorized for the operation
     * 2. Remove task from complete tasks table
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
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(),
                requester, ContentType.TASK,
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
        for (UserGroup userGroup : project.getGroup().getUsers()) {
            if (!userGroup.isAccepted()) {
                continue;
            }
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
    public List<CompletedTask> getCompletedTasks(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        List<CompletedTask> completedTasks = this.completedTaskRepository.findCompletedTaskByProject(project);
        return completedTasks
                .stream().sorted((c1, c2) -> c2.getUpdatedAt().compareTo(c1.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    /**
     * Uncomplete completed task.
     * <p>
     * 1. Check if requester is allowed to operate with this action
     * 2. Remove task from Completed Task table
     * 3. Create a new task and add it to regular Task table
     *
     * @param requester the username of action requester
     * @param taskId    the task id
     * @retVal Long - the completed task id
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Long uncomplete(String requester, Long taskId) {
        CompletedTask task = this.completedTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));
        Long projectId = task.getProject().getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(),
                requester, ContentType.TASK,
                Operation.UPDATE, projectId, task.getProject().getOwner());
        List<TaskContent> contents = getCompletedTaskContents(taskId, requester);
        this.completedTaskRepository.delete(task);
        Long newId = create(projectId, task.getOwner(), getCreateTaskParams(task)).getId();
        for (TaskContent content : contents) {
            this.addContent(newId, content.getOwner(), content);
        }
        return newId;
    }

    /**
     * Remove reminder setting from CreateTaskParams
     *
     * @param task the task object to be completed
     * @return CreateTaskParams - a create task parameter object contains completed task creation information
     */
    private CreateTaskParams getCreateTaskParams(CompletedTask task) {
        return new CreateTaskParams(task.getName(), task.getAssignedTo(), task.getDueDate(),
                task.getDueTime(), task.getDuration(), null, task.getTimezone(), task.getRecurrenceRule());
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

        deleteTaskAndAdjustRelations(
                requester, task,
                (targetTasks) -> targetTasks.forEach((t) -> {
                    t.setProject(project);
                    this.taskRepository.save(t);
                }),
                (target) -> {
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

    /**
     * Get Contents for project
     *
     * @param projectItemId the project item id
     * @param requester     the username of action requester
     * @return List<TaskContent>
     */
    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<TaskContent> getContents(Long projectItemId, String requester) {
        Task task = this.getProjectItem(projectItemId, requester);
        List<TaskContent> contents = this.taskContentRepository.findTaskContentByTask(task)
                .stream().sorted(Comparator.comparingLong(a -> a.getCreatedAt().getTime()))
                .collect(Collectors.toList());
        return contents;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<TaskContent> getCompletedTaskContents(Long taskId, String requester) {
        CompletedTask task = getCompletedTask(taskId, requester);
        return Arrays.asList(GSON.fromJson(task.getContents(), TaskContent[].class));
    }
}
