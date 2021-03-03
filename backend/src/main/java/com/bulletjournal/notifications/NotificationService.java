package com.bulletjournal.notifications;

import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.daemon.Reminder;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.notifications.informed.Informed;
import com.bulletjournal.redis.RedisEtagDaoJpa;
import com.bulletjournal.repository.*;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.templates.repository.SampleTaskDaoJpa;
import com.bulletjournal.util.CustomThreadFactory;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

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
    @Lazy
    private Reminder reminder;

    @Autowired
    @Lazy
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Autowired
    private NoteDaoJpa noteDaoJpa;

    @Lazy
    @Autowired
    private SampleTaskDaoJpa sampleTaskDaoJpa;

    @Autowired
    private CompletedTaskRepository completedTaskRepository;

    @Autowired
    public NotificationService(NotificationDaoJpa notificationDaoJpa, AuditableDaoJpa auditableDaoJpa,
                               SearchIndexDaoJpa searchIndexDaoJpa, RedisEtagDaoJpa redisEtagDaoJpa) {
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

    public void remind(Remindable remindable) {
        LOGGER.info("Received remindable: " + remindable);
        if (remindable == null) {
            return;
        }
        this.eventQueue.offer(remindable);
    }

    public void deleteESDocument(RemoveElasticsearchDocumentEvent removeElasticsearchDocumentEvent) {
        LOGGER.info("Received removeESDocument: " + removeElasticsearchDocumentEvent);
        if (removeElasticsearchDocumentEvent == null) {
            return;
        }
        this.eventQueue.offer(removeElasticsearchDocumentEvent);
    }

    public void saveCompleteTasks(SaveCompleteTasksEvent saveCompleteTasksEvent) {
        LOGGER.info("Received saveCompleteTask: " + saveCompleteTasksEvent);
        if (saveCompleteTasksEvent == null) {
            return;
        }
        this.eventQueue.offer(saveCompleteTasksEvent);
    }

    public void cacheEtag(EtagEvent etagEvent) {
        LOGGER.info("Received etag: " + etagEvent);
        if (etagEvent == null) {
            return;
        }
        this.eventQueue.offer(etagEvent);
    }

    public void addContentBatch(ContentBatch contentBatch) {
        if (contentBatch == null) {
            return;
        }
        LOGGER.info("Received contentBatch: {}", contentBatch.getContents().size());
        this.eventQueue.offer(contentBatch);
    }

    public void createSampleProjects(SampleProjectsCreation sampleProjectsCreation) {
        LOGGER.info("Received sampleProjectsCreation: " + sampleProjectsCreation);
        if (sampleProjectsCreation == null) {
            return;
        }
        this.eventQueue.offer(sampleProjectsCreation);
    }

    public void addSampleTaskChange(SampleTaskChange sampleTaskChange) {
        LOGGER.info("Received sampleTaskChange: " + sampleTaskChange);
        if (sampleTaskChange == null) {
            return;
        }
        this.eventQueue.offer(sampleTaskChange);
    }

    public void handleImportSampleTasksEvent(ImportSampleTasksEvent event) {
        LOGGER.info("Received ImportSampleTasksEvent: {}", event);
        if (event == null) {
            return;
        }
        this.eventQueue.offer(event);
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
            List<SaveCompleteTasksEvent> saveCompleteTasksEvents = new ArrayList<>();
            List<EtagEvent> etagEvents = new ArrayList<>();
            List<Remindable> remindables = new ArrayList<>();
            List<ContentBatch> contentBatches = new ArrayList<>();
            List<SampleProjectsCreation> sampleProjectsCreations = new ArrayList<>();
            List<SampleTaskChange> sampleTaskChanges = new ArrayList<>();
            List<ImportSampleTasksEvent> importSampleTasksEvents = new ArrayList<>();
            events.forEach((e) -> {
                if (e instanceof Informed) {
                    informeds.add((Informed) e);
                } else if (e instanceof Auditable) {
                    auditables.add((Auditable) e);
                } else if (e instanceof RemoveElasticsearchDocumentEvent) {
                    removeElasticsearchDocumentEvents.add((RemoveElasticsearchDocumentEvent) e);
                } else if (e instanceof SaveCompleteTasksEvent) {
                    saveCompleteTasksEvents.add((SaveCompleteTasksEvent) e);
                } else if (e instanceof EtagEvent) {
                    etagEvents.add((EtagEvent) e);
                } else if (e instanceof Remindable) {
                    remindables.add((Remindable) e);
                } else if (e instanceof ContentBatch) {
                    contentBatches.add((ContentBatch) e);
                } else if (e instanceof SampleProjectsCreation) {
                    sampleProjectsCreations.add((SampleProjectsCreation) e);
                } else if (e instanceof SampleTaskChange) {
                    sampleTaskChanges.add((SampleTaskChange) e);
                } else if (e instanceof ImportSampleTasksEvent) {
                    importSampleTasksEvents.add((ImportSampleTasksEvent) e);
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
                if (!saveCompleteTasksEvents.isEmpty()) {
                    saveCompleteTasksEvents.forEach(saveCompleteTasksEvent -> {
                        this.completedTaskRepository.saveAll(saveCompleteTasksEvent.getCompletedTaskList());
                    });
                }
            } catch (Exception ex) {
                LOGGER.error("Error on saving completeTasks", ex);
            }
            try {
                if (!etagEvents.isEmpty()) {
                    this.redisEtagDaoJpa.create(etagEvents);
                }
            } catch (Exception ex) {
                LOGGER.error("Error on deleting records in RedisEtagDaoJpa", ex);
            }

            try {
                if (!remindables.isEmpty()) {
                    this.reminder.generateTaskReminder(remindables.stream().map(e -> e.getTask()).collect(Collectors.toList()));
                }
            } catch (Exception ex) {
                LOGGER.error("Error on Reminder", ex);
            }

            try {
                // batch contents is only for tasks
                for (ContentBatch batch : contentBatches) {
                    this.taskDaoJpa.addContent(batch.getProjectItems(), batch.getOwners(), batch.getContents());
                }
            } catch (Exception ex) {
                LOGGER.error("Error on ContentBatch", ex);
            }

            try {
                for (SampleProjectsCreation sampleProjectsCreation : sampleProjectsCreations) {
                    Pair<Project, Project> result = this.projectDaoJpa.createSampleProjects(sampleProjectsCreation);
                    this.taskDaoJpa.createSampleTasks(sampleProjectsCreation.getUsername(), result.getLeft());
                    this.noteDaoJpa.createSampleNotes(sampleProjectsCreation.getUsername(), result.getRight());
                }
            } catch (Exception ex) {
                LOGGER.error("Error on SampleProjectsCreation", ex);
            }

            for (SampleTaskChange sampleTaskChange : sampleTaskChanges) {
                try {
                    this.sampleTaskDaoJpa.handleSampleTaskChange(sampleTaskChange.getId());
                } catch (Exception ex) {
                    LOGGER.error("Error on SampleTaskChange", ex);
                }
            }

            for (ImportSampleTasksEvent importSampleTasksEvent : importSampleTasksEvents) {
                try {
                    this.taskDaoJpa.createTaskFromSampleTask(
                            importSampleTasksEvent.getImportTasksParams().getProjectId(),
                            importSampleTasksEvent.getRequester(),
                            importSampleTasksEvent.getSampleTasks(),
                            importSampleTasksEvent.getRepoSampleTasks(),
                            importSampleTasksEvent.getImportTasksParams().getReminderBefore(),
                            importSampleTasksEvent.getImportTasksParams().getAssignees(),
                            importSampleTasksEvent.getImportTasksParams().getLabels());
                } catch (Exception ex) {
                    LOGGER.error("Error on SampleTaskChange", ex);
                }
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
