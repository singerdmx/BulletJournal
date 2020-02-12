package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Notification;
import com.bulletjournal.repository.NotificationDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NotificationController {

    protected static final String NOTIFICATIONS_ROUTE = "/api/notifications";

    @Autowired
    private NotificationDaoJpa notificationDaoJpa;

    @GetMapping(NOTIFICATIONS_ROUTE)
    public List<Notification> getNotification() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.notificationDaoJpa.getNotifications(username);
    }
}
