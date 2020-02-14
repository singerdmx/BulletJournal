package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.Project;
import com.bulletjournal.controller.models.Projects;
import com.bulletjournal.controller.models.UpdateProjectParams;
import com.bulletjournal.repository.ProjectDaoJpa;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class ProjectController {

    protected static final String PROJECTS_ROUTE = "/api/projects";
    protected static final String PROJECT_ROUTE = "/api/projects/{projectId}";

    @Autowired
    private ProjectDaoJpa projectDaoJpa;


    @GetMapping(PROJECTS_ROUTE)
    public Projects getProjects() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.projectDaoJpa.getProjects(username);
    }

    @PostMapping(PROJECTS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody CreateProjectParams project) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return projectDaoJpa.create(project, username).toPresentationModel();
    }

    @PatchMapping(PROJECT_ROUTE)
    public Project updateProject(@NotNull @PathVariable Long projectId,
                                  @Valid @RequestBody UpdateProjectParams updateProjectParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.projectDaoJpa.partialUpdate(username, projectId, updateProjectParams).toPresentationModel();
    }

    @PutMapping(PROJECTS_ROUTE)
    public void updateProjectRelations(@Valid @RequestBody List<Project> projects) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.projectDaoJpa.updateUserProjects(username, projects);
    }
}