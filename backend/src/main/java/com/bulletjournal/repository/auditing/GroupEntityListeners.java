package com.bulletjournal.repository.auditing;

import com.bulletjournal.notifications.EtagEvent;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.models.Group;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;

public class GroupEntityListeners {
    @Autowired
    NotificationService notificationService;

    @PostPersist
    public void postPersist(Object entity) {
        Group group = (Group) entity;
        EtagEvent etagEvent = new EtagEvent(String.valueOf(group.getId()),
                EtagType.GROUP);
        this.notificationService.cacheEtag(etagEvent);
    }

    @PostRemove
    public void postDelete(Object entity) {
        Group group = (Group) entity;
        group.getUsers().forEach(u -> {
            EtagEvent etagEvent = new EtagEvent(u.getUser().getName(),
                    EtagType.GROUP_DELETE);
            this.notificationService.cacheEtag(etagEvent);
        });
    }

}
