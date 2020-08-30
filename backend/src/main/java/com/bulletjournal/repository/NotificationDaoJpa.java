package com.bulletjournal.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.clients.DaemonServiceClient;
import com.bulletjournal.notifications.Action;
import com.bulletjournal.notifications.Informed;
import com.bulletjournal.notifications.JoinGroupEvent;
import com.bulletjournal.protobuf.daemon.grpc.types.Event;
import com.bulletjournal.protobuf.daemon.grpc.types.JoinGroupEvents;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.factory.Etaggable;
import com.bulletjournal.repository.models.Notification;
import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

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
    private DaemonServiceClient daemonServiceClient;
    @Value("${sendEmail}")
    private boolean needSendEmail;


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
        this.notificationRepository.saveAll(notifications);
        if (needSendEmail) {
            sendEmail(joinGroupEventNotifications);
        }
    }

    private void sendEmail(List<Notification> joinGroupEventNotifications) {
        List<Event> eventListProto = new ArrayList<>();
        joinGroupEventNotifications.forEach((notification -> {
            Event event = Event.newBuilder()
                    .setContentId(notification.getContentId())
                    .setTargetUser(notification.getTargetUser())
                    .setContentName(notification.getContent() == null ? "" : notification.getContent())
                    .setOriginatorAlias(notification.getOriginator())
                    .setNotificationId(notification.getId())
                    .build();
            eventListProto.add(event);
        }));
        com.bulletjournal.protobuf.daemon.grpc.types.JoinGroupEvent joinGroupEvent =
                com.bulletjournal.protobuf.daemon.grpc.types.JoinGroupEvent.newBuilder()
                        .addAllEvents(eventListProto)
                        .build();
        JoinGroupEvents joinGroupEvents = JoinGroupEvents.newBuilder()
                .addJoinGroupEvents(joinGroupEvent)
                .build();
        daemonServiceClient.sendEmail(joinGroupEvents);
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
