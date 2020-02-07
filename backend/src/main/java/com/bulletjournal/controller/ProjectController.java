package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.Project;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.repository.ProjectRepository;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProjectController {

    protected static final String PROJECTS_ROUTE = "/api/projects";

    @Autowired
    private ProjectRepository projectRepository;

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
        return convert(projectRepository.save(convert(project, username)));
    }

    private Project convert(com.bulletjournal.repository.models.Project project) {
        return new Project(project.getId(), project.getName(), project.getOwner(),
                ProjectType.getType(project.getType()));
    }

    private com.bulletjournal.repository.models.Project convert(
            CreateProjectParams createProjectParams, String owner) {
        com.bulletjournal.repository.models.Project project =
                new com.bulletjournal.repository.models.Project();
        project.setOwner(owner);
        project.setName(createProjectParams.getName());
        project.setType(createProjectParams.getProjectType().getValue());
        return project;
    }
}