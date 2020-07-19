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
        Notification notification = (Notification) entity;
        EtagEvent etagEvent = new EtagEvent(String.valueOf(notification.getId()),
                EtagType.NOTIFICATION);
        this.notificationService.cacheEtag(etagEvent);
    }

    @PostRemove
    public void postDelete(Object entity) {
        Notification notification = (Notification) entity;
        EtagEvent etagEvent = new EtagEvent(notification.getTargetUser(),
                EtagType.NOTIFICATION_DELETE);
        this.notificationService.cacheEtag(etagEvent);
    }
}
