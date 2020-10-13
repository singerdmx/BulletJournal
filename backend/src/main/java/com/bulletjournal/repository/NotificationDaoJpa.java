package com.bulletjournal.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.messaging.MessagingService;
import com.bulletjournal.notifications.Action;
import com.bulletjournal.notifications.Informed;
import com.bulletjournal.notifications.JoinGroupEvent;
import com.bulletjournal.redis.RedisNotificationRepository;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.redis.models.JoinGroupNotification;
import com.bulletjournal.repository.factory.Etaggable;
import com.bulletjournal.repository.models.Notification;
import com.bulletjournal.util.StringUtil;
import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class NotificationDaoJpa implements Etaggable {

    private static final Gson GSON = new Gson();
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserClient userClient;
    @Autowired
    private UserAliasDaoJpa userAliasDaoJpa;
    @Autowired
    private RedisNotificationRepository redisNotificationRepository;

    @Autowired
    private MessagingService messagingService;


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
        List<Notification> notifications = new ArrayList<>();
        List<Notification> joinGroupEventNotifications = new ArrayList<>();

        events.forEach(event -> {
            List<Notification> list = event.toNotifications(userAliasDaoJpa);
            if (event instanceof JoinGroupEvent) {
                joinGroupEventNotifications.addAll(list);
            }
            notifications.addAll(list);
        });

        if (!notifications.isEmpty()) {
            this.notificationRepository.saveAll(notifications);
        }

        if (!joinGroupEventNotifications.isEmpty()) {
            List<JoinGroupNotification> joinGroupNotifications = new ArrayList<>();
            List<Pair<String, Notification>> joinGroupNotificationsWithUIDs = new ArrayList<>();

            joinGroupEventNotifications.forEach(n -> {
                String uid = RandomStringUtils.randomAlphanumeric(StringUtil.UUID_LENGTH);
                joinGroupNotificationsWithUIDs.add(new ImmutablePair<String, Notification>(uid, n));
                joinGroupNotifications.add(new JoinGroupNotification(uid, n.getId()));
            });
            this.redisNotificationRepository.saveAll(joinGroupNotifications);

            messagingService.sendJoinGroupNotificationEmailsToUser(joinGroupNotificationsWithUIDs);
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteAllExpiredNotifications(Timestamp expirationTime) {
        this.notificationRepository.deleteByUpdatedAtBefore(expirationTime);
    }

    @Override
    public Set<String> findAffectedUsernames(Set<String> contentIds, EtagType type) {
        if (EtagType.NOTIFICATION.equals(type)) {
            List<Long> ids = contentIds.stream().map(Long::parseLong).collect(Collectors.toList());
            return this.notificationRepository.findAllById(ids)
                    .stream().filter(Objects::nonNull)
                    .map(n -> n.getTargetUser()).collect(Collectors.toSet());
        }

        Preconditions.checkArgument(EtagType.NOTIFICATION_DELETE.equals(type));
        return contentIds;
    }

    @Override
    public String getUserEtag(String username) {
        List<com.bulletjournal.controller.models.Notification> notifications = this.getNotifications(username);
        return EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, notifications);
    }
}
