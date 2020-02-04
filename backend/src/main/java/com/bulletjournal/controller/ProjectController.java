package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Project;
import com.bulletjournal.repository.ProjectRepository;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/api/projects")
    public List<Project> getProjects() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return projectRepository.findByOwner(username)
                .stream().map(this::convert).collect(Collectors.toList());
    }

    @PostMapping("/api/projects")
    public Project createProject(@Valid @RequestBody Project project) {
        return convert(projectRepository.save(convert(project)));
    }

    private Project convert(com.bulletjournal.repository.models.Project project) {
        return new Project(project.getId(), project.getName(), project.getOwner());
    }

    private com.bulletjournal.repository.models.Project convert(Project project) {
        return new com.bulletjournal.repository.models.Project(
                project.getId(), project.getName(), project.getOwner());
    }
}