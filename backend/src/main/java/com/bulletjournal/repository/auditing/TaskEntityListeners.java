package com.bulletjournal.repository.auditing;

import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.Remindable;
import com.bulletjournal.repository.models.Task;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

public class TaskEntityListeners {
    @Autowired
    NotificationService notificationService;

    @PostPersist
    @PostUpdate
    public void postPersist(Object entity) {
        Task task = (Task) entity;
        this.notificationService.remind(new Remindable(task));
    }

}
