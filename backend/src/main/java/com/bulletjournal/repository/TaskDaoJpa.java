package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateTaskParams;
import com.bulletjournal.controller.utils.IntervalHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.TaskRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.common.collect.Iterables;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class TaskDaoJpa {

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
    private UserRepository userRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Task> getTasks(Long projectId) {
        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        if (!projectTasksOptional.isPresent()) {
            return Collections.emptyList();
        }
        ProjectTasks projectTasks = projectTasksOptional.get();
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        Map<Long, Task> tasks = this.taskRepository.findTaskByProject(project)
                .stream().collect(Collectors.toMap(Task::getId, n -> n));
        return TaskRelationsProcessor.processRelations(tasks, projectTasks.getTasks());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task getTask(Long id) {
        return this.taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + id + " not found"));
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
    public List<com.bulletjournal.controller.models.Task> getRemindingTask(String assignee, ZonedDateTime now) {
        List<User> user = this.userRepository.findByName(assignee);
        if (user.size() == 0)
            throw new ResourceNotFoundException("Assignee " + assignee + " not found");

        List<Task> tasks = this.taskRepository.findTaskByAssignedTo(assignee);
        Timestamp currentTime = Timestamp.from(now.toInstant());
        return this.taskRepository
                .findRemindingTask(assignee, currentTime)
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
    public List<com.bulletjournal.controller.models.Task> getTasksBetween(String assignee, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<User> user = this.userRepository.findByName(assignee);
        if (user.size() == 0)
            throw new ResourceNotFoundException("Assignee " + assignee + " not found");

        return this.taskRepository.findTasksOfAssigneeBetween(assignee,
                Timestamp.from(startTime.toInstant()), Timestamp.from(endTime.toInstant()))
                .stream().map(Task::toPresentationModel).collect(Collectors.toList());
    }

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

        String date = createTaskParams.getDueDate();
        String time = createTaskParams.getDueTime();
        String timezone = createTaskParams.getTimezone();
        task.setStartTime(Timestamp.from(IntervalHelper.getStartTime(date, time, timezone).toInstant()));
        task.setEndTime(Timestamp.from(IntervalHelper.getEndTime(date, time, timezone).toInstant()));
        task.setReminderSetting(createTaskParams.getReminderSetting());

        task = this.taskRepository.save(task);

        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        final ProjectTasks projectTasks = projectTasksOptional.orElseGet(ProjectTasks::new);

        String newRelations = HierarchyProcessor.addItem(projectTasks.getTasks(), task.getId());
        projectTasks.setProjectId(projectId);
        projectTasks.setTasks(newRelations);
        this.projectTasksRepository.save(projectTasks);
        return task;
    }

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

        String date = updateTaskParams.getOrDefaultDate(task.getDueDate());
        String time = updateTaskParams.getOrDefaultTime(task.getDueTime());
        String timezone = updateTaskParams.getOrDefaultTimezone(updateTaskParams.getTimezone());

        DaoHelper.updateIfPresent(updateTaskParams.needsUpdateDateTime(),
                Timestamp.from(IntervalHelper.getStartTime(date, time, timezone).toInstant()), task::setStartTime);

        DaoHelper.updateIfPresent(updateTaskParams.needsUpdateDateTime(),
                Timestamp.from(IntervalHelper.getEndTime(date, time, timezone).toInstant()), task::setEndTime);

        DaoHelper.updateIfPresent(updateTaskParams.hasReminderSetting(), updateTaskParams.getReminderSetting(),
                task::setReminderSetting);

        this.taskRepository.save(task);
        return events;
    }

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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public CompletedTask complete(String requester, Long taskId) {
        Task task = this.taskRepository
                .findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                task.getOwner(), requester, ContentType.TASK, Operation.UPDATE, taskId);

        CompletedTask completedTask = new CompletedTask(task);
        this.completedTaskRepository.save(completedTask);
        this.taskRepository.delete(task);

        // TODO: remove task in relations
        return completedTask;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserTasks(Long projectId, List<com.bulletjournal.controller.models.Task> tasks) {
        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        final ProjectTasks projectTasks = projectTasksOptional.orElseGet(ProjectTasks::new);

        projectTasks.setTasks(TaskRelationsProcessor.processRelations(tasks));
        projectTasks.setProjectId(projectId);

        this.projectTasksRepository.save(projectTasks);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> deleteTask(String requester, Long taskId) {
        Task task = this.taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

        Project project = task.getProject();
        Long projectId = project.getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(task.getOwner(), requester, ContentType.PROJECT,
                Operation.DELETE, projectId, project.getOwner());

        ProjectTasks projectTasks = this.projectTasksRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectTasks by " + projectId + " not found"));

        String relations = projectTasks.getTasks();

        // delete tasks and its subTasks
        List<Task> targetTasks = this.taskRepository.findAllById(HierarchyProcessor.getSubItems(relations, taskId));
        this.taskRepository.deleteAll(targetTasks);

        // Update task relations
        List<HierarchyItem> hierarchy = HierarchyProcessor.removeTargetItem(relations, taskId);
        projectTasks.setTasks(GSON.toJson(hierarchy));
        this.projectTasksRepository.save(projectTasks);

        return generateEvents(task, requester, project);
    }

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
        // TODO: sort by last_updated
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        return this.completedTaskRepository.findCompletedTaskByProject(project);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.Task setLabels(Long taskId, List<Long>labels) {
        Task task = this.taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));
        task.setLabels(Iterables.toArray(labels, Long.class));
        return task.toPresentationModel();
    }
}
