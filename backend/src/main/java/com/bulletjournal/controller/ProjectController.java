package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.models.params.CreateProjectParams;
import com.bulletjournal.controller.models.params.UpdateProjectParams;
import com.bulletjournal.controller.models.params.UpdateSharedProjectsOrderParams;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.notifications.*;
import com.bulletjournal.notifications.informed.CreateProjectEvent;
import com.bulletjournal.notifications.informed.JoinProjectEvent;
import com.bulletjournal.notifications.informed.RemoveFromProjectEvent;
import com.bulletjournal.notifications.informed.RemoveProjectEvent;
import com.bulletjournal.repository.AuditableDaoJpa;
import com.bulletjournal.repository.ProjectDaoJpa;
import com.bulletjournal.controller.models.ProjectSetting;
import com.bulletjournal.repository.ProjectSettingDaoJpa;
import com.bulletjournal.repository.ProjectSettingRepository;
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
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.IF_NONE_MATCH;

@RestController
public class ProjectController {
    protected static final String PROJECTS_ROUTE = "/api/projects";
    protected static final String PROJECT_ROUTE = "/api/projects/{projectId}";
    protected static final String PROJECT_SET_OWNER_ROUTE = "/api/projects/{projectId}/setOwner";
    protected static final String PROJECT_SETTINGS_ROUTE = "/api/projects/{projectId}/settings";
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

    @Autowired
    private ProjectSettingDaoJpa projectSettingDaoJpa;

    @Autowired
    private ProjectSettingRepository projectSettingRepository;

    @GetMapping(PROJECTS_ROUTE)
    public ResponseEntity<Projects> getProjects() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<com.bulletjournal.repository.models.Project> projectsForSetting = new ArrayList<>();
        Projects projects = this.projectDaoJpa.getProjects(username, projectsForSetting);
        List<Long> ids = projectsForSetting.stream().map(com.bulletjournal.repository.models.Project::getId)
                .collect(Collectors.toList());
        List<com.bulletjournal.repository.models.ProjectSetting> projectSettings = this.projectSettingRepository
                .findByIdIn(ids).stream().filter(Objects::nonNull).collect(Collectors.toList());
        Map<Long, ProjectSetting> settings = projectSettings.stream()
                .collect(Collectors.toMap(com.bulletjournal.repository.models.ProjectSetting::getId,
                        com.bulletjournal.repository.models.ProjectSetting::toPresentationModel));
        projects.setSettings(settings);

        String ownedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, projects.getOwned());

        String sharedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, projects.getShared());

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(ownedProjectsEtag + "|" + sharedProjectsEtag);
        return ResponseEntity.ok().headers(responseHeader).body(Projects.addOwnerAvatar(projects, this.userClient));
    }

    @GetMapping(PROJECT_ROUTE)
    public ProjectDetails getProject(@NotNull @PathVariable Long projectId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Project project = this.projectDaoJpa.getProject(projectId, username).toVerbosePresentationModel();
        ProjectDetails projectDetails = new ProjectDetails(Project.addOwnerAvatar(project, this.userClient));
        ProjectSetting projectSetting = this.projectSettingDaoJpa.getProjectSetting(projectId);
        projectDetails.setProjectSetting(projectSetting);
        return projectDetails;
    }

    @PutMapping(PROJECT_SETTINGS_ROUTE)
    public ProjectDetails setProjectSetting(@NotNull @PathVariable Long projectId,
                                   @NotNull @Valid @RequestBody ProjectSetting setting) {
        String projectColor = setting.getColor();
        boolean autoDelete = setting.isAutoDelete();
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.projectSettingDaoJpa.setProjectSetting(username,
                this.projectDaoJpa.getProject(projectId, username), projectColor, autoDelete);
        return getProject(projectId);
    }

    @PostMapping(PROJECT_SET_OWNER_ROUTE)
    public Project setProjectOwner(@NotNull @PathVariable Long projectId,
                                            @NotNull @Valid @RequestBody String owner) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.projectDaoJpa.setProjectOwner(projectId, owner, username);
        return getProject(projectId);
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
    public ProjectDetails updateProject(@NotNull @PathVariable Long projectId,
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
        ProjectDetails project = getProject(projectId);
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