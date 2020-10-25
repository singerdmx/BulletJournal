package com.bulletjournal.daemon;

import com.bulletjournal.config.ReminderConfig;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.daemon.models.ReminderRecord;
import com.bulletjournal.messaging.MessagingService;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.TaskRepository;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.utils.DaoHelper;
import com.bulletjournal.util.CustomThreadFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class Reminder {
    private static final Logger LOGGER = LoggerFactory.getLogger(Reminder.class);
    private static long SECONDS_OF_DAY = 86400;
    private static long VERIFY_BUFF_SECONDS = 7200;
    private static long SCHEDULE_BUFF_SECONDS = 5;
    private static long AWAIT_TERMINATION_SECONDS = 5;

    private final ScheduledExecutorService executorService;
    private final ConcurrentHashMap<ReminderRecord, Task> concurrentHashMap;
    private final TaskDaoJpa taskDaoJpa;
    private final MessagingService messagingService;

    @Autowired
    private ReminderConfig reminderConfig;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    Reminder(TaskDaoJpa taskDaoJpa, MessagingService messagingService) {
        this.taskDaoJpa = taskDaoJpa;
        this.messagingService = messagingService;
        this.concurrentHashMap = new ConcurrentHashMap();
        this.executorService = Executors.newSingleThreadScheduledExecutor(new CustomThreadFactory("Reminder"));
    }

    @PostConstruct
    public void postConstruct() {
        LOGGER.info(reminderConfig.toString());

        executorService.schedule(() -> this.initLoad(), 1, TimeUnit.MILLISECONDS);
        executorService.scheduleWithFixedDelay(this::cronJob,
                SECONDS_OF_DAY - ZonedDateTimeHelper.getPassedSecondsOfDay(reminderConfig.getTimeZone()),
                this.reminderConfig.getCronJobSeconds(),
                TimeUnit.SECONDS);
    }

    private void initLoad() {
        LOGGER.info("initLoad");
        ZonedDateTime start = ZonedDateTime.now().minus(reminderConfig.getLoadPrevSeconds(), ChronoUnit.SECONDS);
        ZonedDateTime end = ZonedDateTime.now().plus(reminderConfig.getLoadNextSeconds(), ChronoUnit.SECONDS);
        this.scheduleReminderRecords(Pair.of(start, end));
    }

    private void cronJob() {
        LOGGER.info("This is Reminder daily cronJob");
        this.purge(this.reminderConfig.getPurgePrevSeconds());

        this.scheduleReminderRecords(this.reminderConfig.getLoadNextSeconds());
    }

    /***
     * called by controller who created or updated task
     * @param createdTask
     */
    public void generateTaskReminder(Task createdTask) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.getInterval(SECONDS_OF_DAY, reminderConfig.getTimeZone());
        taskRepository.findById(createdTask.getId()).ifPresent(task -> {
            DaoHelper.getReminderRecords(task, interval.getFirst(), interval.getSecond()).forEach(e -> {
                        if (!concurrentHashMap.containsKey(e)) {
                            this.scheduleReminderRecords(reminderConfig.getLoadNextSeconds());
                        }
                    }
            );
        });

    }

    public void generateTaskReminder(List<Task> tasks) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.getInterval(SECONDS_OF_DAY, reminderConfig.getTimeZone());

        tasks.forEach(t -> {
            LOGGER.info("generateTaskReminder" + t);
            DaoHelper.getReminderRecords(t, interval.getFirst(), interval.getSecond()).forEach(e -> {
                LOGGER.info("getReminderRecords" + e);
                        if (!concurrentHashMap.containsKey(e)) {
                            LOGGER.info("getReminderRecords in map" + e);
                            this.scheduleReminderRecords(reminderConfig.getLoadNextSeconds());
                        }
                    }
            );
        });

    }

    private void purge(long expiredSeconds) {
        concurrentHashMap.entrySet().removeIf(e ->
                e.getKey().getTimestampSecond() + expiredSeconds < ZonedDateTime.now().toEpochSecond());
    }

    private void scheduleReminderRecords(Pair<ZonedDateTime, ZonedDateTime> interval) {
        taskDaoJpa.getRemindingTasks(interval.getFirst(), interval.getSecond()).forEach((k, v) -> {
            long delay = k.getTimestampSecond() - ZonedDateTime.now().toEpochSecond() - SCHEDULE_BUFF_SECONDS;
            if (!concurrentHashMap.containsKey(k) && delay > 0) {
                LOGGER.info("Schedule New Job:" + k.toString() + "\t delay=" + delay);
                executorService.schedule(() -> this.process(k), delay, TimeUnit.SECONDS);
                concurrentHashMap.put(k, v);
            }
        });
    }

    private void scheduleReminderRecords(long seconds) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.getInterval(seconds, reminderConfig.getTimeZone());
        this.scheduleReminderRecords(interval);
    }

    private void process(ReminderRecord record) {
        LOGGER.info("process record=" + record.toString());
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.getInterval(VERIFY_BUFF_SECONDS, reminderConfig.getTimeZone());
        taskRepository.findById(record.getId()).ifPresent(task -> {
            Map<ReminderRecord, Task> map = DaoHelper.getReminderRecordMap(task, interval.getFirst(), interval.getSecond());
            if (map.keySet().contains(record)) {
                Task clonedTask = map.get(record);
                LOGGER.info("Push notification record = " + record + "clonedTask = " + clonedTask);
                messagingService.sendTaskDueNotificationAndEmailToUsers(Arrays.asList(clonedTask));
            }
            concurrentHashMap.remove(record);
        });
    }

    @PreDestroy
    public void preDestroy() {
        if (executorService != null) {
            try {
                executorService.awaitTermination(AWAIT_TERMINATION_SECONDS, TimeUnit.SECONDS);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        }
    }

}
