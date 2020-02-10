package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.repository.TaskDaoJpa;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class TaskController {

    protected static final String TASKS_ROUTE = "/api/projects/{projectId}/tasks";
    protected static final String TASK_ROUTE = "/api/projects/{projectId}/{taskId}";

    @Autowired
    private TaskDaoJpa taskDaoJpa;


    @GetMapping(TASKS_ROUTE)
    public List<Task> getTasks(@NotNull @PathVariable Long projectId) {

    }

    @PostMapping(TASKS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@NotNull @PathVariable Long projectId,
                           String assignedTo, String dueDate, String dueTime,
                           String createdBy, String name) {
        return taskDaoJpa.create(project, assignedTo, dueDate, dueTime, createdBy, name).toPresentationModel();
    }

    @PatchMapping(TASK_ROUTE)
    public Project updateTask(@NotNull @PathVariable Long taskId,
                              String assignedTo, String dueDate, String dueTime, String createdBy, String name) {

    }

    @PutMapping(TASKS_ROUTE)
    public void updateProjectRelations(@Valid @RequestBody List<Project> projects) {
    }
}