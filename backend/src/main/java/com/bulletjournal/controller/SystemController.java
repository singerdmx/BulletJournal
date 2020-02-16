package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Group;
import com.bulletjournal.controller.models.Notification;
import com.bulletjournal.controller.models.Projects;
import com.bulletjournal.controller.models.SystemUpdates;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.repository.GroupDaoJpa;
import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.repository.ProjectDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SystemController {

    public static final String UPDATES_ROUTE = "/api/system/updates";

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Autowired
    private NotificationDaoJpa notificationDaoJpa;

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @GetMapping(UPDATES_ROUTE)
    public SystemUpdates getUpdates() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Projects projects = this.projectDaoJpa.getProjects(username);
        List<Notification> notificationList = this.notificationDaoJpa.getNotifications(username);
        List<Group> groupList = this.groupDaoJpa.getGroups(username);

        String ownedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE,
                projects.getOwned());

        String sharedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE,
                projects.getShared());

        String notificationsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE,
                notificationList);

        String groupsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE,
                groupList);

        SystemUpdates systemUpdates = new SystemUpdates();
        systemUpdates.setOwnedProjectsEtag(ownedProjectsEtag);
        systemUpdates.setSharedProjectsEtag(sharedProjectsEtag);
        systemUpdates.setNotificationsEtag(notificationsEtag);
        systemUpdates.setGroupsEtag(groupsEtag);
        return systemUpdates;
    }
}
