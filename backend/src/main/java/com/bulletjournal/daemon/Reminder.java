package com.bulletjournal.daemon;

import com.bulletjournal.config.ReminderConfig;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.daemon.models.ReminderRecord;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.util.CustomThreadFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.sql.Timestamp;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class Reminder {
    private static final Logger LOGGER = LoggerFactory.getLogger(Reminder.class);
    private static int MINUTES_OF_DAY = 1440;
    private static int MINUTES_OF_HOUR = 60;
    private static int SECONDS_OF_MINUTE = 60;
    private static int SECONDS_OF_DAY = 86400;

    private final ScheduledExecutorService executorService;
    private final ConcurrentHashMap<ReminderRecord, ReminderRecord> concurrentHashMap;
    @Autowired
    ReminderConfig reminderConfig;
    private TaskDaoJpa taskDaoJpa;

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
        this.loadReminderRecords(reminderConfig.getLoadPrevSeconds());
        this.loadReminderRecords(reminderConfig.getLoadNextSeconds());
    }

    private void cronJob() {
        this.purge(this.reminderConfig.getPurgePrevSeconds());

        this.loadReminderRecords(this.reminderConfig.getLoadNextSeconds());
    }

    private void purge(int hours) {
        System.out.println("Purge work");
    }

    private List<Task> loadReminderRecords(int seconds) {
        Timestamp start = new Timestamp(Calendar.getInstance().getTimeInMillis());
        Timestamp end = Timestamp.from((start.toInstant().plus(seconds, ChronoUnit.SECONDS)));

        return taskDaoJpa.getTasks(start, end);
    }
}
