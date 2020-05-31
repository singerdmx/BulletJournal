package com.bulletjournal.notifications;

import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.repository.models.Notification;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MockedNotificationDaoJpa extends NotificationDaoJpa {

    private List<Notification> notifications = Collections.synchronizedList(new ArrayList<>());

    @Override
    public synchronized void create(List<Informed> informedList) {
        informedList.forEach(informed -> informed.getEvents().forEach(event -> {
            this.notifications.add(new Notification(
                    informed.getOriginator(),
                    informed.getEventTitle(event),
                    informed.getEventContent(event),
                    event.getTargetUser(),
                    informed.getEventType(),
                    event.getContentId(),
                    informed.getLink(event.getContentId())));
        }));
    }

    @Override
    public synchronized List<com.bulletjournal.controller.models.Notification> getNotifications(String username) {
        List<com.bulletjournal.controller.models.Notification> results = new ArrayList<>();
        for (Notification n : this.notifications) {
            results.add(new com.bulletjournal.controller.models.Notification(
                    n.getId(), n.getTitle(), n.getContent(), System.currentTimeMillis(), n.getType(), null));
        }
        return results;
    }
}
