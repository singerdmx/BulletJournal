package com.bulletjournal.repository.auditing;


import com.bulletjournal.notifications.EtagEvent;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.models.Notification;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;

public class NotificationEntityListeners {

    @Autowired
    NotificationService notificationService;

    @PostPersist
    public void postPersist(Object entity) {
        cacheEtag((Notification) entity);
    }

    @PostRemove
    public void postDelete(Object entity) {
        cacheEtag((Notification) entity);
    }

    private void cacheEtag(Notification notification) {
        EtagEvent etagEvent = new EtagEvent(notification.getId() + "",
                EtagType.NOTIFICATION);
        notificationService.cacheEtag(etagEvent);
    }
}
