package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.notifications.*;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.models.CompletedTask;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class TaskController {

    protected static final String TASKS_ROUTE = "/api/projects/{projectId}/tasks";
    protected static final String TASK_ROUTE = "/api/tasks/{taskId}";
    protected static final String COMPLETED_TASK_ROUTE = "/api/completeTasks/{taskId}";
    protected static final String COMPLETE_TASK_ROUTE = "/api/tasks/{taskId}/complete";
    protected static final String UNCOMPLETE_TASK_ROUTE = "/api/tasks/{taskId}/uncomplete";
    protected static final String COMPLETED_TASKS_ROUTE = "/api/projects/{projectId}/completedTasks";
    protected static final String TASK_SET_LABELS_ROUTE = "/api/tasks/{taskId}/setLabels";
    protected static final String MOVE_TASK_ROUTE = "/api/tasks/{taskId}/move";
    protected static final String SHARE_TASK_ROUTE = "/api/tasks/{taskId}/share";

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private NotificationService notificationService;

    @GetMapping(TASKS_ROUTE)
    public ResponseEntity<List<Task>> getTasks(@NotNull @PathVariable Long projectId) {
        List<Task> tasks = this.taskDaoJpa.getTasks(projectId);
        String tasksEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, tasks);

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(tasksEtag);

        return ResponseEntity.ok().headers(responseHeader).body(tasks);
    }

    @GetMapping(TASK_ROUTE)
    public Task getTask(@NotNull @PathVariable Long taskId) {
        return this.taskDaoJpa.getTask(taskId);
    }

    @GetMapping(COMPLETED_TASK_ROUTE)
    public Task getCompletedTask(@NotNull @PathVariable Long taskId) {
        return this.taskDaoJpa.getCompletedTask(taskId);
    }

    @PostMapping(TASKS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@NotNull @PathVariable Long projectId,
                           @Valid @RequestBody CreateTaskParams task) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return taskDaoJpa.create(projectId, username, task).toPresentationModel();
    }

    @PatchMapping(TASK_ROUTE)
    public Task updateTask(@NotNull @PathVariable Long taskId,
                           @Valid @RequestBody UpdateTaskParams updateTaskParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.taskDaoJpa.partialUpdate(username, taskId, updateTaskParams);
        if (!events.isEmpty()) {
            notificationService.inform(new UpdateTaskAssigneeEvent(events, username, updateTaskParams.getAssignedTo()));
        }
        return getTask(taskId);
    }

    @PutMapping(TASKS_ROUTE)
    public ResponseEntity<List<Task>> updateTaskRelations(@NotNull @PathVariable Long projectId, @Valid @RequestBody List<Task> tasks) {
        this.taskDaoJpa.updateUserTasks(projectId, tasks);
        return getTasks(projectId);
    }

    @PostMapping(COMPLETE_TASK_ROUTE)
    public Task completeTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        CompletedTask task = this.taskDaoJpa.complete(username, taskId);
        return getCompletedTask(task.getId());
    }

    @PostMapping(UNCOMPLETE_TASK_ROUTE)
    public Task uncompleteTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Long newId = this.taskDaoJpa.uncomplete(username, taskId);
        return getTask(newId);
    }

    @GetMapping(COMPLETED_TASKS_ROUTE)
    public List<Task> getCompletedTasks(@NotNull @PathVariable Long projectId) {
        return this.taskDaoJpa.getCompletedTasks(projectId)
                .stream().map(t -> t.toPresentationModel()).collect(Collectors.toList());
    }

    @DeleteMapping(TASK_ROUTE)
    public ResponseEntity<List<Task>> deleteTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Task task = getTask(taskId);
        List<Event> events = this.taskDaoJpa.deleteTask(username, taskId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveTaskEvent(events, username));
        }
        return getTasks(task.getProjectId());
    }

    @PutMapping(TASK_SET_LABELS_ROUTE)
    public Task setLabels(@NotNull @PathVariable Long taskId,
                          @NotNull @RequestBody List<Long> labels) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.notificationService.inform(this.taskDaoJpa.setLabels(username, taskId, labels));
        return getTask(taskId);
    }

    @PostMapping(MOVE_TASK_ROUTE)
    public void moveTask(@NotNull @PathVariable Long taskId,
                         @NotNull @RequestBody MoveProjectItemParams moveProjectItemParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.taskDaoJpa.move(username, taskId, moveProjectItemParams.getTargetProject());
    }

    @PostMapping(SHARE_TASK_ROUTE)
    public String shareTask(
            @NotNull @PathVariable Long taskId,
            @NotNull @RequestBody ShareProjectItemParams shareProjectItemParams) {
        return null; // may be generated link
    }
}