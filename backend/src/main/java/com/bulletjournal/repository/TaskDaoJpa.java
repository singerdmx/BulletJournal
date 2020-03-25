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
import java.time.temporal.ChronoField;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Repository
public class TaskDaoJpa extends ProjectItemDaoJpa {

    private static final Gson GSON = new Gson();

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

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

    @Override
    public JpaRepository getJpaRepository() {
        return this.taskRepository;
    }

    /*
     * Get tasks by project identifier
     *
     * @retVal List<com.bulletjournal.controller.models.Task> - a list of controller model tasks with labels
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getTasks(Long projectId) {
        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        if (!projectTasksOptional.isPresent()) {
            return Collections.emptyList();
        }
        ProjectTasks projectTasks = projectTasksOptional.get();
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        Map<Long, Task> tasksMap = this.taskRepository.findTaskByProject(project)
                .stream().collect(Collectors.toMap(Task::getId, n -> n));
        return TaskRelationsProcessor.processRelations(tasksMap, projectTasks.getTasks())
                .stream()
                .map(task -> {
                    List<com.bulletjournal.controller.models.Label> labels =
                            TaskDaoJpa.this.getLabelsToProjectItem(tasksMap.get(task.getId()));
                    task.setLabels(labels);
                    return task;
                })
                .collect(Collectors.toList());
    }

    /*
     * Get completed task by task identifier
     *
     * 1. Get task from database
     * 2. Look up task labels and add to task
     *
     * @retVal com.bulletjournal.controller.models.Task - controller model task with label
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.Task getTask(Long id) {
        Task task = this.getProjectItem(id);
        List<com.bulletjournal.controller.models.Label> labels = this.getLabelsToProjectItem(task);
        return task.toPresentationModel(labels);
    }

    /*
     * Get completed tasks from database
     *
     * @retVal List<com.bulletjournal.controller.models.Task> - A list of completed tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.Task getCompletedTask(Long id) {
        CompletedTask task = this.completedTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + id + " not found"));
        return task.toPresentationModel();
    }

    /*
     * Get reminding tasks from database.
     *
     * Reminding tasks qualifications:
     * 1. Reminding Time is before current time.
     * 2. Starting time is after the current time.
     *
     * @retVal List<com.bulletjournal.controller.models.Task> - A list of tasks to be reminded
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getRemindingTasks(String assignee, ZonedDateTime now) {
        Timestamp currentTime = Timestamp.from(now.toInstant());
        return this.taskRepository
                .findRemindingTasks(assignee, currentTime)
                .stream()
                .map(TaskModel::toPresentationModel)
                .collect(Collectors.toList());
    }

    /*
     * Get user's tasks between the request start time and request end time.
     *
     * @retVal List<com.bulletjournal.controller.models.Task> - A list of tasks
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getTasksBetween(String assignee, ZonedDateTime startTime, ZonedDateTime endTime) {

        List<Task> tasks = this.taskRepository.findTasksOfAssigneeBetween(
                assignee, Timestamp.from(startTime.toInstant()), Timestamp.from(endTime.toInstant()));

        List<Task> recurrentTasks = this.getRecurrentTasks(assignee, startTime, endTime);

        tasks.addAll(recurrentTasks);
        return tasks;
    }

    /*
     * Get all recurrent tasks of an assignee
     *
     * @retVal List<Task> - A list of recurrent tasks within the time range
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getRecurrentTasks(String assignee, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Task> recurrentTasksBetween = new ArrayList<>();
        List<Task> recurrentTasks = this.taskRepository.findTasksByAssignedToAndRecurrenceRuleNotNull(assignee);
        long startMoment = startTime.getLong(ChronoField.INSTANT_SECONDS);
        long endMoment = endTime.getLong(ChronoField.INSTANT_SECONDS);

        for (Task t : recurrentTasks) {
            String recurrenceRule = t.getRecurrenceRule();
            try {
                BuJoRecurrenceRule rule = new BuJoRecurrenceRule(recurrenceRule);

                RecurrenceRuleIterator it = rule.getIterator();
                while (it.hasNext()) {
                    DateTime nextInstance = it.nextDateTime();
                    long currTime = nextInstance.getTimestamp();
                    if (currTime > endMoment) {
                        break;
                    }
                    if (currTime < startMoment) {
                        continue;
                    }

                    recurrentTasksBetween.add(t);
                }
            } catch (InvalidRecurrenceRuleException e) {
                throw new IllegalArgumentException("Recurrence rule format invalid");
            }
        }
        return recurrentTasksBetween;
    }

    /*
     * Create task based on CreateTaskParams
     *
     * @retVal Task - A repository task model
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task create(Long projectId, String owner, CreateTaskParams createTaskParams) {

        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
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

    /*
     * Partially update task based on UpdateTaskParams
     *
     * @retVal List<Event> - a list of events that is used to notify users
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> partialUpdate(String requester, Long taskId, UpdateTaskParams updateTaskParams) {

        Task task = this.taskRepository
                .findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                task.getOwner(), requester, ContentType.TASK, Operation.UPDATE,
                taskId, task.getProject().getOwner());

        DaoHelper.updateIfPresent(updateTaskParams.hasDuration(), updateTaskParams.getDuration(),
                task::setDuration);

        DaoHelper.updateIfPresent(
                updateTaskParams.hasName(), updateTaskParams.getName(), task::setName);

        List<Event> events = updateAssignee(requester, taskId, updateTaskParams, task);

        DaoHelper.updateIfPresent(
                updateTaskParams.hasDueDate(), updateTaskParams.getDueDate(), task::setDueDate);

        DaoHelper.updateIfPresent(
                updateTaskParams.hasDueTime(), updateTaskParams.getDueTime(), task::setDueTime);

        DaoHelper.updateIfPresent(
                updateTaskParams.hasTimezone(), updateTaskParams.getTimezone(), task::setTimezone);

        DaoHelper.updateIfPresent(
                updateTaskParams.hasRecurrenceRule(), updateTaskParams.getRecurrenceRule(), task::setRecurrenceRule);

        String date = updateTaskParams.getOrDefaultDate(task.getDueDate());
        String time = updateTaskParams.getOrDefaultTime(task.getDueTime());
        String timezone = updateTaskParams.getOrDefaultTimezone(updateTaskParams.getTimezone());

        DaoHelper.updateIfPresent(updateTaskParams.needsUpdateDateTime(),
                Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()), task::setStartTime);

        DaoHelper.updateIfPresent(updateTaskParams.needsUpdateDateTime(),
                Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()), task::setEndTime);

        DaoHelper.updateIfPresent(updateTaskParams.hasReminderSetting(), updateTaskParams.getReminderSetting(),
                task::setReminderSetting);

        this.taskRepository.save(task);
        return events;
    }

    /*
     * Add assignee change event to notification
     */
    private List<Event> updateAssignee(String requester, Long taskId, UpdateTaskParams updateTaskParams, Task task) {
        List<Event> events = new ArrayList<>();
        String newAssignee = updateTaskParams.getAssignedTo();
        String oldAssignee = task.getAssignedTo();
        if (!Objects.equals(newAssignee, oldAssignee)) {
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

    /*
     * Set a task to complete
     *
     * 1. Get task from task table
     * 2. Delete task and its sub tasks from task table
     * 3. Add task and its sub tasks to complete task table
     *
     * @retVal CompleteTask - a repository model complete task object
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CompletedTask complete(String requester, Long taskId) {

        Task task = this.taskRepository
                .findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(),
                requester, ContentType.TASK,
                Operation.UPDATE, task.getProject().getId(), task.getProject().getOwner());


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
        this.completedTaskRepository.save(completedTask);
        return completedTask;
    }

    /*
     * Update sub tasks relation
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserTasks(Long projectId, List<com.bulletjournal.controller.models.Task> tasks) {
        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        final ProjectTasks projectTasks = projectTasksOptional.orElseGet(ProjectTasks::new);

        projectTasks.setTasks(TaskRelationsProcessor.processRelations(tasks));
        projectTasks.setProjectId(projectId);

        this.projectTasksRepository.save(projectTasks);
    }

    /*
     * Delete requester's task by task identifier
     *
     * @retVal List<Event> - a list of notification events
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> deleteTask(String requester, Long taskId) {
        Task task = this.taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));
        Project project = deleteTaskAndAdjustRelations(
                requester, task,
                (targetTasks) -> this.taskRepository.deleteAll(targetTasks),
                (target) -> {
                });

        return generateEvents(task, requester, project);
    }

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

    /*
     * Generate events for notification
     *
     * @retVal List<Event> - a list of events for notifications
     */
    private List<Event> generateEvents(Task task, String requester, Project project) {
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<CompletedTask> getCompletedTasks(Long projectId) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        List<CompletedTask> completedTasks = this.completedTaskRepository.findCompletedTaskByProject(project);
        return completedTasks
                .stream().sorted((c1, c2) -> c2.getUpdatedAt().compareTo(c1.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Long uncomplete(String requester, Long taskId) {
        CompletedTask task = this.completedTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));
        Long projectId = task.getProject().getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(),
                requester, ContentType.TASK,
                Operation.UPDATE, projectId, task.getProject().getOwner());
        this.completedTaskRepository.delete(task);
        return create(projectId, task.getOwner(), getCreateTaskParams(task)).getId();
    }

    private CreateTaskParams getCreateTaskParams(CompletedTask task) {
        return new CreateTaskParams(task.getName(), task.getAssignedTo(), task.getDueDate(),
                task.getDueTime(), task.getDuration(), null, task.getTimezone(), task.getRecurrenceRule());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void move(String requester, Long taskId, Long targetProject) {
        final Project project = this.projectRepository.findById(targetProject)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + targetProject + " not found"));

        Task task = this.taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

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

    @Override
    public JpaRepository getContentJpaRepository() {
        return this.taskContentRepository;
    }
}
