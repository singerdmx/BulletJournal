package com.bulletjournal.notifications;

import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.redis.RedisEtagDaoJpa;
import com.bulletjournal.redis.models.Etag;
import com.bulletjournal.repository.AuditableDaoJpa;
import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.util.CustomThreadFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Service
public class NotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);
    private final ExecutorService executorService;
    private final BlockingQueue<Object> eventQueue;
    private final NotificationDaoJpa notificationDaoJpa;
    private final AuditableDaoJpa auditableDaoJpa;
    private final SearchIndexDaoJpa searchIndexDaoJpa;
    private final RedisEtagDaoJpa redisEtagDaoJpa;
    private volatile boolean stop = false;

    @Autowired
    private SpringESConfig springESConfig;

    @Autowired
    public NotificationService(NotificationDaoJpa notificationDaoJpa, AuditableDaoJpa auditableDaoJpa, SearchIndexDaoJpa searchIndexDaoJpa, RedisEtagDaoJpa redisEtagDaoJpa) {
        this.notificationDaoJpa = notificationDaoJpa;
        this.auditableDaoJpa = auditableDaoJpa;
        this.searchIndexDaoJpa = searchIndexDaoJpa;
        this.redisEtagDaoJpa = redisEtagDaoJpa;
        this.executorService = Executors.newSingleThreadExecutor(new CustomThreadFactory("notification-service"));
        this.eventQueue = new LinkedBlockingQueue<>();
    }

    @PostConstruct
    public void postConstruct() {
        this.executorService.submit(() -> this.handleNotifications());
    }

    public void inform(Informed informed) {
        LOGGER.info("Received informed: " + informed);
        if (informed.getEvents().isEmpty()) {
            return;
        }
        this.eventQueue.offer(informed);
    }

    public void trackActivity(Auditable auditable) {
        LOGGER.info("Received auditable: " + auditable);
        if (auditable == null) {
            return;
        }
        this.eventQueue.offer(auditable);
    }

    public void deleteESDocument(RemoveElasticsearchDocumentEvent removeElasticsearchDocumentEvent) {
        LOGGER.info("Received removeESDocument: " + removeElasticsearchDocumentEvent);
        if (removeElasticsearchDocumentEvent == null) {
            return;
        }
        this.eventQueue.offer(removeElasticsearchDocumentEvent);
    }

    public void cacheEtag(Etag etag) {
        LOGGER.info("Received etag: " + etag);
        if (etag == null) {
            return;
        }
        this.eventQueue.offer(etag);
    }

    public void handleNotifications() {
        Thread.currentThread().setPriority(Thread.MIN_PRIORITY);
        List<Object> events = new ArrayList<>();

        while (!stop) {
            try {
                // waiting until an element becomes available
                events.add(this.eventQueue.take());
            } catch (Exception ex) {
                LOGGER.error("Error on taking from eventQueue", ex);
            }
            try {
                this.eventQueue.drainTo(events);
            } catch (Exception ex) {
                LOGGER.error("Error on draining from eventQueue", ex);
            }
            List<Informed> informeds = new ArrayList<>();
            List<Auditable> auditables = new ArrayList<>();
            List<RemoveElasticsearchDocumentEvent> removeElasticsearchDocumentEvents = new ArrayList<>();
            List<Etag> etags = new ArrayList<>();
            events.forEach((e) -> {
                if (e instanceof Informed) {
                    informeds.add((Informed) e);
                } else if (e instanceof Auditable) {
                    auditables.add((Auditable) e);
                } else if (e instanceof RemoveElasticsearchDocumentEvent) {
                    removeElasticsearchDocumentEvents.add((RemoveElasticsearchDocumentEvent) e);
                } else if (e instanceof Etag) {
                    etags.add((Etag) e);
                }
            });
            try {
                if (!informeds.isEmpty()) {
                    this.notificationDaoJpa.create(informeds);
                }
            } catch (Exception ex) {
                LOGGER.error("Error on creating records in notificationDaoJpa", ex);
            }
            try {
                if (!auditables.isEmpty()) {
                    this.auditableDaoJpa.create(auditables);
                }
            } catch (Exception ex) {
                LOGGER.error("Error on creating records in AuditableDaoJpa", ex);
            }
            try {
                if (!removeElasticsearchDocumentEvents.isEmpty() && this.springESConfig.getEnable()) {
                    this.searchIndexDaoJpa.delete(removeElasticsearchDocumentEvents);
                }
            } catch (Exception ex) {
                LOGGER.error("Error on deleting records in SearchIndexDaoJpa", ex);
            }
            try {
                if (!etags.isEmpty()) {
                    this.redisEtagDaoJpa.create(etags);
                }
            } catch (Exception ex) {
                LOGGER.error("Error on deleting records in RedisEtagDaoJpa", ex);
            }
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
