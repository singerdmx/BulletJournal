package com.bulletjournal.notifications;

import com.bulletjournal.repository.NotificationDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Service
public class NotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);
    private final ExecutorService executorService;
    private final BlockingQueue<Informed> eventQueue;
    private final NotificationDaoJpa notificationDaoJpa;
    private volatile boolean stop = false;

    @Autowired
    public NotificationService(NotificationDaoJpa notificationDaoJpa) {
        this.notificationDaoJpa = notificationDaoJpa;
        this.executorService = Executors.newSingleThreadExecutor();
        this.eventQueue = new LinkedBlockingQueue<>();
        this.executorService.submit(() -> this.handleNotifications());
    }

    public void inform(Informed informed) {
        if (informed.getEvents().isEmpty()) {
            return;
        }
        this.eventQueue.offer(informed);
    }

    public void handleNotifications() {
        List<Informed> events = new ArrayList<>();

        while (!stop) {
            try {
                // waiting until an element becomes available
                events.add(this.eventQueue.take());
            } catch (InterruptedException ex) {
                LOGGER.error("Error on taking from eventQueue", ex);
            }
            this.eventQueue.drainTo(events);
            this.notificationDaoJpa.create(events);
            events = new ArrayList<>();
        }
    }

    @PreDestroy
    public void preDestroy() {
        this.stop = true;
        if (executorService != null) {
            try {
                // wait 5 seconds for closing all threads
                executorService.awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
