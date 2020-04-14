package com.bulletjournal.controller;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.*;
import com.bulletjournal.repository.models.ProjectItemModel;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.*;

import static org.springframework.http.HttpHeaders.IF_NONE_MATCH;

@RestController
public class SystemController {

    public static final String UPDATES_ROUTE = "/api/system/updates";
    public static final String PUBLIC_ITEM_ROUTE_PREFIX = "/api/public/items/";
    public static final String PUBLIC_ITEM_ROUTE = PUBLIC_ITEM_ROUTE_PREFIX + "{itemId}";

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Autowired
    private NotificationDaoJpa notificationDaoJpa;

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private NoteDaoJpa noteDaoJpa;

    @Autowired
    private PublicProjectItemDaoJpa publicProjectItemDaoJpa;

    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;

    @Autowired
    private NoteController noteController;

    @Autowired
    private TaskController taskController;

    @GetMapping(UPDATES_ROUTE)
    public SystemUpdates getUpdates(@RequestParam(name = "targets", required = false) String targets,
                                    @RequestParam(name = "projectId", required = false) Long projectId,
                                    @RequestHeader(IF_NONE_MATCH) Optional<String> remindingTaskRequestEtag) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Set<String> targetEtags = null;
        if (StringUtils.isNotBlank(targets)) {
            targetEtags = new HashSet<>(Arrays.asList(targets.split(",")));
        }
        String ownedProjectsEtag = null;
        String sharedProjectsEtag = null;
        String tasksEtag = null;
        String notesEtag = null;
        String notificationsEtag = null;
        String groupsEtag = null;
        String remindingTaskEtag = null;
        List<Task> remindingTasks = null;

        if (targetEtags == null || targetEtags.contains("projectsEtag")) {
            Projects projects = this.projectDaoJpa.getProjects(username);
            ownedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE,
                    projects.getOwned());
            sharedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE,
                    projects.getShared());
        }
        if (targetEtags == null || targetEtags.contains("notificationsEtag")) {
            List<Notification> notificationList = this.notificationDaoJpa.getNotifications(username);
            notificationsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE,
                    notificationList);
        }

        if (projectId != null) {
            Project project = this.projectDaoJpa.getProject(projectId, username).toPresentationModel();
            switch (project.getProjectType()) {
                case TODO:
                    List<Task> taskList = this.taskDaoJpa.getTasks(projectId, username);
                    tasksEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                            EtagGenerator.HashType.TO_HASHCODE,
                            taskList);
                    break;
                case NOTE:
                    List<Note> noteList = this.noteDaoJpa.getNotes(projectId, username);
                    notesEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                            EtagGenerator.HashType.TO_HASHCODE,
                            noteList);
                    break;
                default:
                    throw new IllegalArgumentException();
            }
        }

        if (targetEtags == null || targetEtags.contains("groupsEtag")) {
            List<Group> groupList = this.groupDaoJpa.getGroups(username);
            groupsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE,
                    groupList);
        }
        if (targetEtags == null || targetEtags.contains("taskReminders")) {
            remindingTasks = this.taskDaoJpa.getRemindingTasks(username, ZonedDateTimeHelper.getNow());
            remindingTaskEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE,
                    remindingTasks);
            if (remindingTaskRequestEtag.isPresent() && remindingTaskEtag.equals(remindingTaskRequestEtag.get())) {
                remindingTasks = null;
            }
        }

        SystemUpdates systemUpdates = new SystemUpdates();
        systemUpdates.setOwnedProjectsEtag(ownedProjectsEtag);
        systemUpdates.setSharedProjectsEtag(sharedProjectsEtag);
        systemUpdates.setNotificationsEtag(notificationsEtag);
        systemUpdates.setTasksEtag(tasksEtag);
        systemUpdates.setNotesEtag(notesEtag);
        systemUpdates.setGroupsEtag(groupsEtag);
        systemUpdates.setReminders(remindingTasks);
        systemUpdates.setRemindingTaskEtag(remindingTaskEtag);
        return systemUpdates;
    }

    @GetMapping(PUBLIC_ITEM_ROUTE)
    public <T extends ProjectItemModel> PublicProjectItem getPublicProjectItem(
            @NotNull @PathVariable String itemId) {
        String originalUser = MDC.get(UserClient.USER_NAME_KEY);
        String username = AuthorizationService.SUPER_USER;
        MDC.put(UserClient.USER_NAME_KEY, username);

        T item;
        if (!isUUID(itemId)) {
            if (StringUtils.isBlank(originalUser)) {
                throw new UnAuthorizedException("User not logged in");
            }
            Long id = Long.parseLong(itemId.substring(4));
            if (itemId.startsWith(ProjectItemType.TASK.name())) {
                if (!this.sharedProjectItemDaoJpa.getSharedProjectItems(originalUser, ProjectType.TODO)
                        .stream().anyMatch(m -> m.getId().equals(id))) {
                    throw new UnAuthorizedException("Task not shared with user " + originalUser);
                }
                item = this.taskDaoJpa.getProjectItem(id, username);
            } else if (itemId.startsWith(ProjectItemType.NOTE.name())) {
                if (!this.sharedProjectItemDaoJpa.getSharedProjectItems(originalUser, ProjectType.NOTE)
                        .stream().anyMatch(m -> m.getId().equals(id))) {
                    throw new UnAuthorizedException("Note not shared with user " + originalUser);
                }
                item = this.noteDaoJpa.getProjectItem(id, username);
            } else {
                throw new BadRequestException("Invalid itemId " + itemId);
            }
        } else {
            item = this.publicProjectItemDaoJpa.getPublicItem(itemId);
        }
        if (item == null) {
            return null;
        }
        List<Content> contents;
        ProjectItem projectItem;
        ContentType contentType = item.getContentType();
        switch (contentType) {
            case NOTE:
                Note note = this.noteController.getNote(item.getId());
                projectItem = note;
                contents = this.noteController.getContents(item.getId());
                break;
            case TASK:
                Task task = this.taskController.getTask(item.getId());
                projectItem = task;
                contents = this.taskController.getContents(item.getId());
                break;
            default:
                throw new IllegalArgumentException();
        }

        return new PublicProjectItem(contentType, contents, projectItem);
    }

    private boolean isUUID(String itemId) {
        if (itemId.length() != PublicProjectItemDaoJpa.UUID_LENGTH) {
            return false;
        }

        if (itemId.startsWith(ProjectItemType.NOTE.name()) || itemId.startsWith(ProjectItemType.TASK.name())) {
            return !itemId.substring(4).chars().allMatch(Character::isDigit);
        }

        return true;
    }
}
