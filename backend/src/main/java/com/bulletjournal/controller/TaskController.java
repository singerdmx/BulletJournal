package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.controller.models.UpdateTaskParams;
import com.bulletjournal.repository.TaskDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @GetMapping(TASKS_ROUTE)
    public List<Task> getTasks(@NotNull @PathVariable Long projectId) {
        return this.taskDaoJpa.getTasks(projectId)
                .stream().map(t -> t.toPresentationModel()).collect(Collectors.toList());
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
        return this.taskDaoJpa.partialUpdate(username, taskId, updateTaskParams).toPresentationModel();
    }

    /*
    @PutMapping(TASKS_ROUTE)
    public void updateProjectRelations(@Valid @RequestBody List<Project> projects) {
    }
     */

    @PostMapping(COMPLETE_TASK_ROUTE)
    public void completeTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.taskDaoJpa.complete(username, taskId);
    }
}