package com.bulletjournal.notifications;

import com.bulletjournal.controller.models.Notification;
import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

/**
 * Tests {@link NotificationService}
 */
public class NotificationServiceTest {

    @Test
    public void testGetUser() {
        MockedNotificationDaoJpa mockedNotificationDaoJpa = new MockedNotificationDaoJpa();
        MockedAuditableDaoJpa mockedAuditableDaoJpa = new MockedAuditableDaoJpa();
        MockSearchIndexDaoJpa mockSearchIndexDaoJpa = new MockSearchIndexDaoJpa();
        MockRedisEtagDaoJpa mockRedisEtagDaoJpa = new MockRedisEtagDaoJpa();
        NotificationService notificationService = new NotificationService(
                mockedNotificationDaoJpa, mockedAuditableDaoJpa, mockSearchIndexDaoJpa, mockRedisEtagDaoJpa);
        notificationService.postConstruct();
        String originator = "BulletJournal";
        String targetUser = "u1";
        for (int i = 0; i < 100; i++) {
            List<Event> events = Arrays.asList(new Event(targetUser, Long.valueOf(i), "G" + i));
            notificationService.inform(new JoinGroupEvent(events, originator));
        }
        for (int i = 100; i < 200; i++) {
            List<Event> events = Arrays.asList(new Event(targetUser, Long.valueOf(i), "G" + i));
            notificationService.inform(new DeleteGroupEvent(events, originator));
        }

        List<Notification> notifications;
        do {
            notifications = mockedNotificationDaoJpa.getNotifications(targetUser);
        } while (notifications.size() < 200);

        Assert.assertEquals(200, notifications.size());
        notificationService.preDestroy();
    }
}
