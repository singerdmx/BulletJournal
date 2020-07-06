package com.bulletjournal.controller;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.filters.rate.limiting.TokenBucket;
import com.bulletjournal.filters.rate.limiting.TokenBucketType;
import com.bulletjournal.redis.RedisEtagRepository;
import com.bulletjournal.redis.models.Etag;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.*;
import com.bulletjournal.repository.models.ProjectItemModel;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

import static org.springframework.http.HttpHeaders.IF_NONE_MATCH;

@RestController
public class SystemController {
    public static final String UPDATES_ROUTE = "/api/system/updates";
    public static final String PUBLIC_ITEM_ROUTE_PREFIX = "/api/public/items/";
    public static final String PUBLIC_ITEM_ROUTE = PUBLIC_ITEM_ROUTE_PREFIX + "{itemId}";
    private static final Logger LOGGER = LoggerFactory.getLogger(SystemController.class);
    private static final String CONTACTS_ROUTE = "/api/contacts";

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

    @Autowired
    private TokenBucket tokenBucket;

    @Autowired
    private UserClient userClient;

    @Autowired
    private RedisEtagRepository redisEtagRepository;

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

            // Look up etag from cache
            //Etag cache = redisEtagRepository.findByIndex(username);

            // If cache missed, write new etag to redis
            //if (Objects.isNull(cache)) {
            List<Notification> notificationList = this.notificationDaoJpa.getNotifications(username);
            notificationsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE,
                    notificationList);
            Etag cached = new Etag(username, EtagType.NOTIFICATION, notificationsEtag);
            redisEtagRepository.save(cached);
            //} else {
            //    notificationsEtag = cache.getEtag();
            //}
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
    public <T extends ProjectItemModel> ResponseEntity<?> getPublicProjectItem(
            @NotNull @PathVariable String itemId) {
        if (this.tokenBucket.isLimitExceeded(TokenBucketType.PUBLIC_ITEM)) {
            LOGGER.error("Get PublicProjectItem limit exceeded");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(null);
        }
        String originalUser = MDC.get(UserClient.USER_NAME_KEY);
        String username = AuthorizationService.SUPER_USER;
        MDC.put(UserClient.USER_NAME_KEY, username);

        T item;
        if (!isUUID(itemId)) {
            if (StringUtils.isBlank(originalUser)) {
                throw new UnAuthorizedException("User not logged in");
            }
            Long id = Long.parseLong(itemId.substring(4)); // both NOTE and TASK are 4 letters
            if (itemId.startsWith(ContentType.TASK.name())) {
                if (!this.sharedProjectItemDaoJpa.getSharedProjectItems(originalUser, ProjectType.TODO)
                        .stream().anyMatch(m -> m.getId().equals(id))) {
                    throw new UnAuthorizedException("Task not shared with user " + originalUser);
                }
                item = this.taskDaoJpa.getProjectItem(id, username);
            } else if (itemId.startsWith(ContentType.NOTE.name())) {
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
                projectItem = this.noteController.getNote(item.getId());
                contents = this.noteController.getContents(item.getId());
                break;
            case TASK:
                projectItem = this.taskController.getTask(item.getId());
                contents = this.taskController.getContents(item.getId());
                break;
            default:
                throw new IllegalArgumentException();
        }

        projectItem.setShared(true);
        contents.forEach(content -> content.setRevisions(new Revision[0])); // clear revisions
        com.bulletjournal.repository.models.Project project = projectDaoJpa.getSharedProject(contentType, originalUser);
        return ResponseEntity.ok().body(
                new PublicProjectItem(contentType, contents, projectItem, project != null ? project.getId() : null));
    }

    private boolean isUUID(String itemId) {
        if (itemId.length() != PublicProjectItemDaoJpa.UUID_LENGTH) {
            return false;
        }

        if (itemId.startsWith(ContentType.NOTE.name()) || itemId.startsWith(ContentType.TASK.name())) {
            return !itemId.substring(4).chars().allMatch(Character::isDigit);
        }

        return true;
    }

    @PostMapping(CONTACTS_ROUTE)
    public ResponseEntity<?> contactSupport(
            @NotNull @Valid @RequestBody CreateContactTopicParams createContactTopicParams)
            throws URISyntaxException {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        String topicUrl = this.userClient.createTopic(username, createContactTopicParams.getContactType(),
                createContactTopicParams.getTitle(), createContactTopicParams.getContent());
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setLocation(new URI(topicUrl));
        return ResponseEntity.ok().headers(responseHeaders).build();
    }
}
