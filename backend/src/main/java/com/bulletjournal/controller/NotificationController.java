package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.AnswerNotificationParams;
import com.bulletjournal.controller.models.Notification;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Action;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.JoinGroupResponseEvent;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.repository.*;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.models.UserGroupKey;
import com.google.common.base.Preconditions;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class NotificationController {

    protected static final String NOTIFICATIONS_ROUTE = "/api/notifications";
    protected static final String ANSWER_NOTIFICATION_ROUTE = "/api/notifications/{notificationId}/answer";

    @Autowired
    private NotificationDaoJpa notificationDaoJpa;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private GroupRepository groupRepository;

    @GetMapping(NOTIFICATIONS_ROUTE)
    public List<Notification> getNotification() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.notificationDaoJpa.getNotifications(username);
    }

    @PostMapping(ANSWER_NOTIFICATION_ROUTE)
    public ResponseEntity<?> answerNotification(
            @NotNull @PathVariable Long notificationId,
            @Valid @RequestBody AnswerNotificationParams answerNotificationParams) {
        processNotification(notificationId, answerNotificationParams);
        return ResponseEntity.ok().build();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void processNotification(@PathVariable @NotNull Long notificationId,
                                    AnswerNotificationParams answerNotificationParams) {
        com.bulletjournal.repository.models.Notification notification =
                this.notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Notification " + notificationId + " not found"));
        switch (notification.getType()) {
            case "JoinGroupEvent":
                String answerAction = answerNotificationParams.getAction();
                Preconditions.checkNotNull(answerAction, "For JoinGroupEvent, action is required");
                Action action = Action.getAction(answerAction);
                User user = this.userDaoJpa.getByName(notification.getTargetUser());
                UserGroupKey userGroupKey = new UserGroupKey(user.getId(), notification.getContentId());
                UserGroup userGroup = this.userGroupRepository.findById(userGroupKey)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("UserGroupKey not found"));
                if (Action.ACCEPT.equals(action)) {
                    // set UserGroup's "accepted" to be true
                    userGroup.setAccepted(true);
                } else {
                    // remove UserGroup
                    this.userGroupRepository.delete(userGroup);
                }

                Group group = this.groupRepository.findById(notification.getContentId()).orElseThrow(() ->
                        new ResourceNotFoundException("Group " + notification.getContentId() + " not found"));
                Event event = new Event(
                        notification.getTargetUser(),
                        notification.getContentId(),
                        group.getName());
                this.notificationService.inform(
                        new JoinGroupResponseEvent(event, notification.getOriginator(), action));
                break;
        }
        this.notificationRepository.delete(notification);
    }
}
