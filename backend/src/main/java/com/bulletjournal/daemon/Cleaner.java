package com.bulletjournal.daemon;

import com.bulletjournal.config.NotificationConfig;
import com.bulletjournal.repository.AuditableDaoJpa;
import com.bulletjournal.repository.GoogleCalendarProjectDaoJpa;
import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.repository.PublicProjectItemDaoJpa;
import com.bulletjournal.util.CustomThreadFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Deprecated
@Service
public class Cleaner {

    private static final Logger LOGGER = LoggerFactory.getLogger(Cleaner.class);
    private final ScheduledExecutorService executorService;
    private final NotificationDaoJpa notificationDaoJpa;
    private final PublicProjectItemDaoJpa publicProjectItemDaoJpa;
    private final GoogleCalendarProjectDaoJpa googleCalendarProjectDaoJpa;

    @Autowired
    private NotificationConfig notificationConfig;

    @Autowired
    private AuditableDaoJpa auditableDaoJpa;

    @Autowired
    public Cleaner(NotificationDaoJpa notificationDaoJpa, PublicProjectItemDaoJpa publicProjectItemDaoJpa,
                   GoogleCalendarProjectDaoJpa googleCalendarProjectDaoJpa) {
        this.executorService = Executors.newSingleThreadScheduledExecutor(new CustomThreadFactory("cleaner"));
        this.notificationDaoJpa = notificationDaoJpa;
        this.publicProjectItemDaoJpa = publicProjectItemDaoJpa;
        this.googleCalendarProjectDaoJpa = googleCalendarProjectDaoJpa;
    }

    @PostConstruct
    public void postConstruct() {
//        int intervalInSeconds = notificationConfig.getCleaner().getIntervalInSeconds();
//        if (intervalInSeconds <= 0) {
//            throw new IllegalArgumentException("Invalid intervalInSeconds: " + intervalInSeconds);
//        }
//
//        this.executorService.scheduleWithFixedDelay(this::clean, 0, intervalInSeconds, TimeUnit.SECONDS);
    }

    public void clean() {
        Thread.currentThread().setPriority(Thread.MIN_PRIORITY);
        try {
            cleanNotification();
        } catch (Exception e) {
            LOGGER.error("cleanNotification error", e);
        }

        try {
            cleanPublicProjectItems();
        } catch (Exception e) {
            LOGGER.error("cleanPublicProjectItems error", e);
        }

        try {
            cleanHistory();
        } catch (Exception e) {
            LOGGER.error("cleanHistory error", e);
        }

        try {
            renewGoogleCalendarWatch();
        } catch (Exception e) {
            LOGGER.error("renewGoogleCalendarWatch error", e);
        }
    }

    private void renewGoogleCalendarWatch() throws IOException {
        this.googleCalendarProjectDaoJpa.renewExpiringGoogleCalendarWatch();
        LOGGER.info("Google Calendar Expiring Watch Cleaning Done");
    }

    private void cleanNotification() {
        int maxRetentionTimeInDays = notificationConfig.getCleaner().getMaxRetentionTimeInDays();
        long expirationTime = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(maxRetentionTimeInDays);

        notificationDaoJpa.deleteAllExpiredNotifications(new Timestamp(expirationTime));
        LOGGER.info("Notification Cleaning Done");
    }

    private void cleanPublicProjectItems() {
        this.publicProjectItemDaoJpa.deleteAllExpiredPublicItems();
        LOGGER.info("PublicProjectItems Cleaning Done");
    }

    private void cleanHistory() {
        int historyMaxRetentionDays = notificationConfig.getCleaner().getHistoryMaxRetentionDays();
        long expirationTime = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(historyMaxRetentionDays);

        auditableDaoJpa.deleteAllExpiredHistory(new Timestamp(expirationTime));
        LOGGER.info("History Cleaning Done");
    }

    @PreDestroy
    public void preDestroy() {
        if (executorService != null) {
            try {
                executorService.awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
