package com.bulletjournal.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.notifications.Action;
import com.bulletjournal.notifications.Informed;
import com.bulletjournal.repository.models.Notification;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class NotificationDaoJpa {

    private static final Gson GSON = new Gson();
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserClient userClient;
    @Autowired
    private UserAliasDaoJpa userAliasDaoJpa;

    public List<com.bulletjournal.controller.models.Notification> getNotifications(String username) {
        List<Notification> notifications = this.notificationRepository.findByTargetUser(username);
        List<com.bulletjournal.controller.models.Notification> returnNotifications = notifications.stream().map(n -> {
            com.bulletjournal.controller.models.Notification notification = n.toPresentationModel();
            notification.setOriginator(this.userClient.getUser(n.getOriginator()));
            if (n.getActions() != null) {
                Action[] actions = GSON.fromJson(n.getActions(), Action[].class);
                notification.setActions(
                        Arrays.asList(actions).stream().map(a -> a.getDescription()).collect(Collectors.toList()));
            }
            return notification;
        }).sorted((a, b) -> {
            if (a.getActions().isEmpty() && !b.getActions().isEmpty()) {
                return 1;
            }
            if (!a.getActions().isEmpty() && b.getActions().isEmpty()) {
                return -1;
            }
            if (a.getTimestamp().compareTo(b.getTimestamp()) == 0) {
                return b.getId().compareTo(a.getId());
            }
            return b.getTimestamp().compareTo(a.getTimestamp());
        }).collect(Collectors.toList());
        return returnNotifications;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(List<Informed> events) {
        events.forEach(event -> event.toNotifications(userAliasDaoJpa).forEach(n -> {
            this.notificationRepository.save(n);
        }));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteAllExpiredNotifications(Timestamp expirationTime) {
        this.notificationRepository.deleteByUpdatedAtBefore(expirationTime);
    }
}
