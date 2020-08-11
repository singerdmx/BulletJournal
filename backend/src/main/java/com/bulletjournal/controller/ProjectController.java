package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.notifications.*;
import com.bulletjournal.repository.AuditableDaoJpa;
import com.bulletjournal.repository.ProjectDaoJpa;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.IF_NONE_MATCH;

@RestController
public class ProjectController {
    protected static final String PROJECTS_ROUTE = "/api/projects";
    protected static final String PROJECT_ROUTE = "/api/projects/{projectId}";
    protected static final String PROJECT_HISTORY_ROUTE = "/api/projects/{projectId}/history";
    protected static final String UPDATE_SHARED_PROJECTS_ORDER_ROUTE = "/api/updateSharedProjectsOrder";
    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);
    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Autowired
    private AuditableDaoJpa auditableDaoJpa;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserClient userClient;

    @GetMapping(PROJECTS_ROUTE)
    public ResponseEntity<Projects> getProjects() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Projects projects = this.projectDaoJpa.getProjects(username);

        String ownedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, projects.getOwned());

        String sharedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, projects.getShared());

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(ownedProjectsEtag + "|" + sharedProjectsEtag);
        return ResponseEntity.ok().headers(responseHeader).body(Projects.addOwnerAvatar(projects, this.userClient));
    }

    @GetMapping(PROJECT_ROUTE)
    public Project getProject(@NotNull @PathVariable Long projectId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Project project = this.projectDaoJpa.getProject(projectId, username).toVerbosePresentationModel();
        return Project.addOwnerAvatar(project, this.userClient);
    }

    @PostMapping(PROJECTS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody CreateProjectParams project) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = new ArrayList<>();
        Project createdProject = projectDaoJpa.create(project, username, events).toVerbosePresentationModel();
        if (!events.isEmpty()) {
            this.notificationService.inform(new CreateProjectEvent(events, username));
        }
        this.notificationService
                .trackActivity(new Auditable(createdProject.getId(), "created BuJo ##" + project.getName() + "##",
                        username, null, Timestamp.from(Instant.now()), ContentAction.ADD_PROJECT));
        return Project.addOwnerAvatar(createdProject, this.userClient);
    }

    @PatchMapping(PROJECT_ROUTE)
    public Project updateProject(@NotNull @PathVariable Long projectId,
            @Valid @RequestBody UpdateProjectParams updateProjectParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> joined = new ArrayList<>();
        List<Event> removed = new ArrayList<>();
        this.projectDaoJpa.partialUpdate(username, projectId, updateProjectParams, joined, removed);
        if (!joined.isEmpty()) {
            this.notificationService.inform(new JoinProjectEvent(joined, username));
        }
        if (!removed.isEmpty()) {
            this.notificationService.inform(new RemoveFromProjectEvent(removed, username));
        }
        Project project = getProject(projectId);
        this.notificationService.trackActivity(new Auditable(projectId, "updated BuJo ##" + project.getName() + "##",
                username, null, Timestamp.from(Instant.now()), ContentAction.UPDATE_PROJECT));
        return project;
    }

    /**
     * Delete project deletes its child projects as well
     */
    @DeleteMapping(PROJECT_ROUTE)
    public void deleteProject(@NotNull @PathVariable Long projectId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Pair<List<Event>, com.bulletjournal.repository.models.Project> res = this.projectDaoJpa.deleteProject(username,
                projectId);
        List<Event> events = res.getLeft();
        String projectName = res.getRight().getName();
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveProjectEvent(events, username));
        }
        this.notificationService.trackActivity(new Auditable(projectId, "deleted BuJo ##" + projectName + "##",
                username, null, Timestamp.from(Instant.now()), ContentAction.DELETE_PROJECT));
    }

    @PostMapping(UPDATE_SHARED_PROJECTS_ORDER_ROUTE)
    public void updateSharedProjectsOrder(
            @Valid @RequestBody UpdateSharedProjectsOrderParams updateSharedProjectsOrderParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        LOGGER.info("updateSharedProjectsOrderParams {}",
                Arrays.toString(updateSharedProjectsOrderParams.getProjectOwners()));
        this.projectDaoJpa.updateSharedProjectsOrder(username, updateSharedProjectsOrderParams);
    }

    @PutMapping(PROJECTS_ROUTE)
    public ResponseEntity<Projects> updateProjectRelations(@Valid @RequestBody List<Project> projects,
            @RequestHeader(IF_NONE_MATCH) Optional<String> projectsEtag) {

        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.projectDaoJpa.updateUserOwnedProjects(username, projects);
        return getProjects();
    }

    @GetMapping(PROJECT_HISTORY_ROUTE)
    public List<Activity> getHistory(@NotNull @PathVariable Long projectId, @NotBlank @RequestParam String timezone,
            @NotBlank @RequestParam String startDate, @NotBlank @RequestParam String endDate,
            @RequestParam @NotNull ContentAction action, @RequestParam @NotBlank String username) {
        String requester = MDC.get(UserClient.USER_NAME_KEY);
        return this.auditableDaoJpa.getHistory(projectId, timezone, startDate, endDate, action, username, requester)
                .stream().map(a -> {
                    User user = this.userClient.getUser(a.getOriginator().getName());
                    a.setOriginator(user);
                    return a;
                }).collect(Collectors.toList());
    }
}