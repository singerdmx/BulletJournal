package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.controller.models.UpdateTaskParams;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveTaskEvent;
import com.bulletjournal.notifications.UpdateTaskAssigneeEvent;
import com.bulletjournal.repository.TaskDaoJpa;
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
    protected static final String COMPLETE_TASK_ROUTE = "/api/tasks/{taskId}/complete";
    protected static final String COMPLETED_TASKS_ROUTE = "/api/projects/{projectId}/completedTasks";
    protected static final String TASK_SET_LABELS_ROUTE = "/api/tasks/{taskId}/setLabels";

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
        return this.taskDaoJpa.getTask(taskId).toPresentationModel();
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
    public void updateTaskRelations(@NotNull @PathVariable Long projectId, @Valid @RequestBody List<Task> tasks) {
        this.taskDaoJpa.updateUserTasks(projectId, tasks);
    }

    @PostMapping(COMPLETE_TASK_ROUTE)
    public Task completeTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.taskDaoJpa.complete(username, taskId).toPresentationModel();
    }

    @GetMapping(COMPLETED_TASKS_ROUTE)
    public List<Task> getCompletedTasks(@NotNull @PathVariable Long projectId) {
        return this.taskDaoJpa.getCompletedTasks(projectId)
                .stream().map(t -> t.toPresentationModel()).collect(Collectors.toList());
    }

    @DeleteMapping(TASK_ROUTE)
    public void deleteTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.taskDaoJpa.deleteTask(username, taskId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveTaskEvent(events, username));
        }
    }

    @PutMapping(TASK_SET_LABELS_ROUTE)
    public Task setLabels(@NotNull @PathVariable Long taskId,
                          @NotNull @RequestBody List<Long> labels) {
        return this.taskDaoJpa.setLabels(taskId, labels);
    }
}