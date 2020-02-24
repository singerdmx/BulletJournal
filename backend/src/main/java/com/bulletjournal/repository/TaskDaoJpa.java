package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.UpdateTaskParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.TaskRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getTasks(Long projectId) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        return this.taskRepository.findTaskByProject(project);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task getTask(Long id) {
        return this.taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + id + " not found"));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task create(Long projectId, String owner, CreateTaskParams createTaskParams) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        Task task = new Task();
        task.setProject(project);
        task.setAssignedTo(owner);
        task.setDueDate(createTaskParams.getDueDate());
        task.setDueTime(createTaskParams.getDueTime());
        task.setOwner(owner);
        task.setName(createTaskParams.getName());
        task.setReminderSetting(createTaskParams.getReminderSetting());
        return this.taskRepository.save(task);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task partialUpdate(String requester, Long taskId, UpdateTaskParams updateTaskParams) {
        Task task = this.taskRepository
                .findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                task.getOwner(), requester, ContentType.TASK, Operation.UPDATE,
                taskId, task.getProject().getOwner());

        DaoHelper.updateIfPresent(
                updateTaskParams.hasName(), updateTaskParams.getName(), (value) -> task.setName(value));

        DaoHelper.updateIfPresent(
                updateTaskParams.hasAssignedTo(), updateTaskParams.getAssignedTo(),
                (value) -> task.setAssignedTo(value));

        DaoHelper.updateIfPresent(
                updateTaskParams.hasDueDate(), updateTaskParams.getDueDate(), (value) -> task.setDueDate(value));

        DaoHelper.updateIfPresent(
                updateTaskParams.hasDueTime(), updateTaskParams.getDueTime(), (value) -> task.setDueTime(value));

        DaoHelper.updateIfPresent(updateTaskParams.hasReminderSetting(), updateTaskParams.getReminderSetting(),
                (value) -> task.setReminderSetting(value));
        return this.taskRepository.save(task);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void complete(String requester, Long taskId) {
        Task task = this.taskRepository
                .findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                task.getOwner(), requester, ContentType.TASK, Operation.UPDATE, taskId);

        CompletedTask completedTask = new CompletedTask(task);
        this.completedTaskRepository.save(completedTask);
        this.taskRepository.delete(task);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserTasks(Long projectId, List<com.bulletjournal.controller.models.Task> tasks) {
        Optional<ProjectTasks> projectTasksOptional = this.projectTasksRepository.findById(projectId);
        final ProjectTasks projectTasks = projectTasksOptional.isPresent() ?
                projectTasksOptional.get() : new ProjectTasks();

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
}
