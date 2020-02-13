package com.bulletjournal.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.notifications.Informed;
import com.bulletjournal.repository.models.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class NotificationDaoJpa {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserClient userClient;

    public List<com.bulletjournal.controller.models.Notification> getNotifications(String username) {
        List<Notification> notifications = this.notificationRepository.findByTargetUser(username);
        return notifications.stream().map(n -> {
            com.bulletjournal.controller.models.Notification notification = n.toPresentationModel();
            notification.setOriginator(this.userClient.getUser(n.getOriginator()));
            return notification;
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(List<Informed> events) {
        events.forEach(event -> {
            event.toNotifications().forEach(n -> this.notificationRepository.save(n));
        });
    }
}
