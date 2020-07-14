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
        cacheEtag((Group) entity);
    }

    @PostRemove
    public void postDelete(Object entity) {
        cacheEtag((Group) entity);
    }

    private void cacheEtag(Group group) {
        EtagEvent etagEvent = new EtagEvent(group.getId() + "",
                EtagType.GROUP);
        notificationService.cacheEtag(etagEvent);
    }
}
