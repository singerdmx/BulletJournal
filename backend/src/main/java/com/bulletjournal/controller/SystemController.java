package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.GroupDaoJpa;
import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.repository.ProjectDaoJpa;
import com.bulletjournal.repository.TaskDaoJpa;
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

    @GetMapping(UPDATES_ROUTE)
    public SystemUpdates getUpdates(@RequestParam(name = "targets", required = false) String targets,
                                    @RequestHeader(IF_NONE_MATCH) Optional<String> remindingTaskRequestEtag) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Set<String> targetEtags = null;
        if (StringUtils.isNotBlank(targets)) {
            targetEtags = new HashSet<>(Arrays.asList(targets.split(",")));
        }
        String ownedProjectsEtag = null;
        String sharedProjectsEtag = null;
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
        systemUpdates.setGroupsEtag(groupsEtag);
        systemUpdates.setReminders(remindingTasks);
        systemUpdates.setRemindingTaskEtag(remindingTaskEtag);
        return systemUpdates;
    }

    @GetMapping(PUBLIC_ITEM_ROUTE)
    public PublicProjectItem getPublicProjectItem(@NotNull @PathVariable String itemId) {
        return new PublicProjectItem();
    }
}
