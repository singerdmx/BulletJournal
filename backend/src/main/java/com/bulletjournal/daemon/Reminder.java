package com.bulletjournal.daemon;

import com.bulletjournal.config.ReminderConfig;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.daemon.models.ReminderRecord;
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
import java.time.ZonedDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class Reminder {
    private static final Logger LOGGER = LoggerFactory.getLogger(Reminder.class);
    private static int SECONDS_OF_DAY = 86400;
    private static long VERIFY_BUFF_SECONDS = 600;
    private static long SCHEDULE_BUFF_SECONDS = 5;

    private final ScheduledExecutorService executorService;
    private final ConcurrentHashMap<ReminderRecord, Task> concurrentHashMap;

    @Autowired
    ReminderConfig reminderConfig;

    @Autowired
    TaskRepository taskRepository;

    private final TaskDaoJpa taskDaoJpa;

    @Autowired
    Reminder(TaskDaoJpa taskDaoJpa) {
        this.taskDaoJpa = taskDaoJpa;
        this.concurrentHashMap = new ConcurrentHashMap();
        this.executorService = Executors.newSingleThreadScheduledExecutor(new CustomThreadFactory("Reminder"));
    }

    @PostConstruct
    public void postConstruct() {
        LOGGER.info(reminderConfig.toString());

        this.initLoad();

        executorService.scheduleWithFixedDelay(this::cronJob,
                SECONDS_OF_DAY - ZonedDateTimeHelper.getPassedSecondsOfDay(reminderConfig.getTimeZone()),
                SECONDS_OF_DAY,
                TimeUnit.SECONDS);
    }

    private void initLoad() {
        this.scheduleReminderRecords(0 - reminderConfig.getLoadPrevSeconds());
        this.scheduleReminderRecords(reminderConfig.getLoadNextSeconds());
    }

    private void cronJob() {
        this.purge(this.reminderConfig.getPurgePrevSeconds());

        this.scheduleReminderRecords(this.reminderConfig.getLoadNextSeconds());
    }

    /***
     * called by controller who created or updated task
     * @param createdTask
     */
    public void generateTaskReminder(Task createdTask) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.nowToNext(SECONDS_OF_DAY, reminderConfig.getTimeZone());
        taskRepository.findById(createdTask.getId()).ifPresent(task -> {
            DaoHelper.getReminderRecords(task, interval.getFirst(), interval.getSecond()).forEach(e -> {
                        if (!concurrentHashMap.containsKey(e)) {
                            this.scheduleReminderRecords(reminderConfig.getLoadNextSeconds());
                        }
                    }
            );
        });

    }

    private void purge(long expiredSeconds) {
        concurrentHashMap.entrySet().removeIf(e ->
                e.getKey().getTimeStampSecond() + expiredSeconds < ZonedDateTime.now().toEpochSecond());
    }

    private void scheduleReminderRecords(long seconds) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.nowToNext(seconds, reminderConfig.getTimeZone());
        taskDaoJpa.getRemindingTasks(interval.getFirst(), interval.getSecond()).forEach((k, v) -> {
            if (!concurrentHashMap.containsKey(k)) {
                executorService.schedule(() -> this.process(k),
                        k.getTimeStampSecond() - ZonedDateTime.now().toEpochSecond() - SCHEDULE_BUFF_SECONDS,
                        TimeUnit.SECONDS);
                concurrentHashMap.put(k, v);
            }
        });
    }

    private void process(ReminderRecord record) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.nowToNext(VERIFY_BUFF_SECONDS, reminderConfig.getTimeZone());

        taskRepository.findById(record.getId()).ifPresent(task -> {
            List<ReminderRecord> records = DaoHelper.getReminderRecords(task, interval.getFirst(), interval.getSecond());
            if (records.contains(record)) {
                LOGGER.info("push notification");
                concurrentHashMap.remove(record);
            }
        });
    }

}
