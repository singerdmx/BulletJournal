package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.Project;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateProjectParams;
import com.bulletjournal.repository.ProjectDaoJpa;
import com.bulletjournal.repository.ProjectRepository;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProjectController {

    protected static final String PROJECTS_ROUTE = "/api/projects";
    protected static final String PROJECT_ROUTE = "/api/projects/{projectId}";

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @GetMapping(PROJECTS_ROUTE)
    public List<Project> getProjects() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return projectRepository.findByOwner(username)
                .stream().map(this::convert).collect(Collectors.toList());
    }

    @PostMapping(PROJECTS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody CreateProjectParams project) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return convert(projectDaoJpa.create(project, username));
    }

    @PatchMapping(PROJECT_ROUTE)
    public Project updateProject(@NotNull @PathVariable Long projectId,
                                  @Valid @RequestBody UpdateProjectParams updateProjectParams) {
        return convert(this.projectDaoJpa.partialUpdate(projectId, updateProjectParams));
    }

    private Project convert(com.bulletjournal.repository.models.Project project) {
        return new Project(project.getId(), project.getName(), project.getOwner(),
                ProjectType.getType(project.getType()));
    }

}