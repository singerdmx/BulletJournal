package com.bulletjournal.repository;

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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Notification> getNotifications(String owner) {
        List<Notification> notifications = this.notificationRepository.findByOwner(owner);
        return notifications.stream().map(Notification::toPresentationModel).collect(Collectors.toList());
    }
}
