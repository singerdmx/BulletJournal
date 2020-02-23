package com.bulletjournal.notifications;

import com.bulletjournal.config.NotificationConfig;
import com.bulletjournal.repository.NotificationDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class NotificationCleaner {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationCleaner.class);
    private final ScheduledExecutorService executorService;
    private final NotificationDaoJpa notificationDaoJpa;

    @Autowired
    private NotificationConfig notificationConfig;

    @Autowired
    public NotificationCleaner(NotificationDaoJpa notificationDaoJpa) {
        this.executorService = Executors.newSingleThreadScheduledExecutor();
        this.notificationDaoJpa = notificationDaoJpa;
    }

    @PostConstruct
    public void postConstruct() {
        int intervalInSeconds = notificationConfig.getCleaner().getIntervalInSeconds();
        if (intervalInSeconds <= 0) {
            throw new IllegalArgumentException("Invalid intervalInSeconds: " + intervalInSeconds);
        }

        this.executorService.scheduleWithFixedDelay(this::cleanNotification, 0, intervalInSeconds, TimeUnit.SECONDS);
    }

    public void cleanNotification() {
        Thread.currentThread().setPriority(Thread.MIN_PRIORITY);
        int maxRetentionTimeInDays = notificationConfig.getCleaner().getMaxRetentionTimeInDays();
        long expirationTime = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(maxRetentionTimeInDays);

        notificationDaoJpa.deleteAllExpiredNotifications(new Timestamp(expirationTime));
        LOGGER.info("Notification Cleaning Done");
    }

    @Override
    public int hashCode() {
        return Objects.hash(executorService, notificationDaoJpa);
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NotificationCleaner)) return false;
        NotificationCleaner that = (NotificationCleaner) o;
        return executorService.equals(that.executorService) &&
                notificationDaoJpa.equals(that.notificationDaoJpa) &&
                notificationConfig.equals(that.notificationConfig);
    }
}
