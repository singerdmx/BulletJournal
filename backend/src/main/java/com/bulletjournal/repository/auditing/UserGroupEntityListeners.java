package com.bulletjournal.repository.auditing;

import com.bulletjournal.notifications.EtagEvent;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.models.UserGroup;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;

public class UserGroupEntityListeners {
    @Autowired
    NotificationService notificationService;

    @PostPersist
    public void postPersist(Object entity) {
        cacheEtag((UserGroup) entity);
    }

    @PostRemove
    public void postDelete(Object entity) {
        cacheEtag((UserGroup) entity);
    }

    private void cacheEtag(UserGroup userGroup) {
        EtagEvent etagEvent = new EtagEvent(String.valueOf(userGroup.getId().getGroupId()),
                EtagType.USER_GROUP);
        notificationService.cacheEtag(etagEvent);
    }
}
