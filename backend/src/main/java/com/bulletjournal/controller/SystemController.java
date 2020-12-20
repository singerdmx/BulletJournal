package com.bulletjournal.controller;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.daemon.Reminder;
import com.bulletjournal.daemon.models.ReminderRecord;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.redis.RedisEtagDaoJpa;
import com.bulletjournal.redis.models.Etag;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.*;
import com.bulletjournal.repository.factory.ProjectItemDaos;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.bulletjournal.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.IF_NONE_MATCH;

@RestController
public class SystemController {
    public static final String UPDATES_ROUTE = "/api/system/updates";
    public static final String PUBLIC_ITEM_ROUTE_PREFIX = "/api/public/items/";
    public static final String PUBLIC_ITEM_ROUTE = PUBLIC_ITEM_ROUTE_PREFIX + "{itemId}";
    private static final String CONTACTS_ROUTE = "/api/contacts";
    private static final String SHARED_ITEM_SET_LABELS_ROUTE = "/api/sharedItems/{itemId}/setLabels";
    private static final Logger LOGGER = LoggerFactory.getLogger(SystemController.class);

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
    private LabelDaoJpa labelDaoJpa;

    @Autowired
    private PublicProjectItemDaoJpa publicProjectItemDaoJpa;

    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;

    @Autowired
    private NoteController noteController;

    @Autowired
    private TaskController taskController;

    @Autowired
    private UserClient userClient;

    @Autowired
    private RedisEtagDaoJpa redisEtagDaoJpa;

    @Autowired
    private ProjectItemDaos projectItemDaos;

    @Autowired
    private Reminder reminder;

    @GetMapping(UPDATES_ROUTE)
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
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
        List<Task> remindingTasks = Collections.emptyList();
        List<Etag> cachingEtags = new ArrayList<>();

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
            Etag cache = this.redisEtagDaoJpa.findEtagsByIndex(username, EtagType.NOTIFICATION);

            if (cache == null) {
                notificationsEtag = this.notificationDaoJpa.getUserEtag(username);
                cachingEtags.add(new Etag(username, EtagType.NOTIFICATION, notificationsEtag));
            } else {
                notificationsEtag = cache.getEtag();
            }
        }
        if (targetEtags == null || targetEtags.contains("groupsEtag")) {

            // Look up etag from cache
            Etag cache = this.redisEtagDaoJpa.findEtagsByIndex(username, EtagType.GROUP);

            if (cache == null) {
                groupsEtag = this.groupDaoJpa.getUserEtag(username);
                cachingEtags.add(new Etag(username, EtagType.GROUP, groupsEtag));
            } else {
                groupsEtag = cache.getEtag();
            }
        }

        if (projectId != null) {
            try {
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
            } catch (Exception ex) {
                LOGGER.info("Skipping tasksEtag or notesEtag");
            }
        }

        if (targetEtags == null || targetEtags.contains("taskReminders")) {
            final ZonedDateTime startTime = ZonedDateTime.now().minusHours(2);
            final ZonedDateTime endTime = ZonedDateTime.now().plusMinutes(2);
            List<ReminderRecord> reminderRecords = this.reminder.getTasksAssignedThatNeedsWebPopupReminder(
                    username, startTime, endTime);
            // clone reminderRecords so we don't hold references to keys of concurrentHashMap
            List<ReminderRecord> reminderRecordsClone = reminderRecords.stream()
                    .map(reminderRecord -> reminderRecord.clone()).collect(Collectors.toList());
            List<Task> tasks = this.reminder.getRemindingTasks(reminderRecordsClone, startTime)
                    .stream().map(t -> t.toPresentationModel()).collect(Collectors.toList());
            remindingTasks = this.labelDaoJpa.getLabelsForProjectItemList(tasks);
            remindingTaskEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE,
                    remindingTasks);
            if (remindingTaskRequestEtag.isPresent() && remindingTaskEtag.equals(remindingTaskRequestEtag.get())) {
                remindingTasks = Collections.emptyList();
            }
        }

        if (cachingEtags.size() > 0) {
            this.redisEtagDaoJpa.batchCache(cachingEtags);
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
    public ResponseEntity<?> getPublicProjectItem(
            @NotNull @PathVariable String itemId) {
        String originalUser = MDC.get(UserClient.USER_NAME_KEY);
        String username = AuthorizationService.SUPER_USER;
        MDC.put(UserClient.USER_NAME_KEY, username);

        ProjectItemModel item;
        if (!isUUID(itemId)) {
            if (StringUtils.isBlank(originalUser)) {
                throw new UnAuthorizedException("User not logged in");
            }
            item = getSharedItem(itemId, originalUser);
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

        if (!isUUID(itemId)) {
            // For shared item, replace projectItem's labels with shared item's labels
            projectItem.setLabels(this.labelDaoJpa.getLabels(item.getSharedItemLabels()));
        }

        projectItem.setShared(true);
        contents.forEach(content -> content.setRevisions(new Revision[0])); // clear revisions
        com.bulletjournal.repository.models.Project project = projectDaoJpa.getSharedProject(contentType, originalUser);
        return ResponseEntity.ok().body(
                new PublicProjectItem(contentType, contents, projectItem, project != null ? project.getId() : null));
    }

    private ProjectItemModel getSharedItem(String itemId, String requester) {
        Pair<Long, ContentType> found = getSharedItemIdAndType(itemId);
        Long id = found.getLeft();
        ContentType contentType = found.getRight();
        if (!this.sharedProjectItemDaoJpa.getSharedProjectItems(requester, contentType)
                .stream().anyMatch(m -> m.getId().equals(id))) {
            throw new UnAuthorizedException("Item not shared with user " + requester);
        }

        return this.projectItemDaos.getDaos().get(ProjectType.fromContentType(contentType))
                .getProjectItem(id, AuthorizationService.SUPER_USER);
    }

    private Pair<Long, ContentType> getSharedItemIdAndType(String itemId) {
        Long id = Long.parseLong(itemId.substring(4)); // both NOTE and TASK are 4 letters
        ContentType contentType = Arrays.stream(ContentType.values()).filter(c -> itemId.startsWith(c.name()))
                .findAny().orElseThrow(() -> new BadRequestException("Invalid itemId " + itemId));
        return Pair.of(id, contentType);
    }

    private boolean isUUID(String itemId) {
        if (itemId.length() != StringUtil.UUID_LENGTH) {
            return false;
        }

        if (itemId.startsWith(ContentType.NOTE.name()) || itemId.startsWith(ContentType.TASK.name())) {
            return !itemId.substring(4).chars().allMatch(Character::isDigit);
        }

        return true;
    }

    @PutMapping(SHARED_ITEM_SET_LABELS_ROUTE)
    public ResponseEntity<?> setLabels(
            @NotNull @PathVariable String itemId, @NotNull @RequestBody List<Long> labels) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Pair<Long, ContentType> found = getSharedItemIdAndType(itemId);
        Long id = found.getLeft();
        ContentType contentType = found.getRight();
        ProjectItemModel projectItem = this.projectItemDaos.getDaos()
                .get(ProjectType.fromContentType(contentType)).getProjectItem(id, username);
        this.sharedProjectItemDaoJpa.setItemLabels(projectItem, contentType, username, labels);
        return getPublicProjectItem(itemId);
    }

    @PostMapping(CONTACTS_ROUTE)
    public ResponseEntity<?> contactSupport(
            @NotNull @Valid @RequestBody CreateContactTopicParams createContactTopicParams)
            throws URISyntaxException {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        String topicUrl = this.userClient.createTopic(username, createContactTopicParams.getForumId(),
                createContactTopicParams.getTitle(), createContactTopicParams.getContent());
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setLocation(new URI(topicUrl));
        return ResponseEntity.ok().headers(responseHeaders).build();
    }
}
