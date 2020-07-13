package com.bulletjournal.daemon;

import com.bulletjournal.config.ReminderConfig;
import com.bulletjournal.util.CustomThreadFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Calendar;
import java.util.TimeZone;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class Reminder {
    private static final Logger LOGGER = LoggerFactory.getLogger(Reminder.class);
    private static int MINUTES_OF_DAY = 1440;
    private static int MINUTES_OF_HOUR = 60;

    private final ScheduledExecutorService executorService;
    private final ConcurrentHashMap concurrentHashMap;


    @Autowired
    ReminderConfig reminderConfig;

    @Autowired
    Reminder() {
        this.concurrentHashMap = new ConcurrentHashMap();
        this.executorService = Executors.newSingleThreadScheduledExecutor(new CustomThreadFactory("Reminder"));
    }

    @PostConstruct
    public void postConstruct() {
        LOGGER.info(reminderConfig.toString());

        this.initLoad();

        this.cronJob();
    }

    private void initLoad() {
        this.loadReminderRecords(reminderConfig.getLoadPrevHours());
        this.loadReminderRecords(reminderConfig.getLoadNextHours());
    }

    private void cronJob() {
        LOGGER.info("Reminder first delay minute: " + this.getInitialDelayMinutes());

        executorService.scheduleWithFixedDelay(
                () -> loadReminderRecords(this.reminderConfig.getLoadNextHours()),
                this.getInitialDelayMinutes(),
                MINUTES_OF_DAY,
                TimeUnit.MINUTES);

        executorService.scheduleWithFixedDelay(
                () -> this.purge(this.reminderConfig.getPurgePrevHours()),
                this.getInitialDelayMinutes(),
                MINUTES_OF_DAY * 2,
                TimeUnit.MINUTES);
    }

    private void loadReminderRecords(int hours) {
        System.out.println("Go database, load hours :" + hours + " reminder");
    }

    private void purge(int hours) {
        System.out.println("Purge work");
    }

    private long getInitialDelayMinutes() {
        Calendar rightNow = Calendar.getInstance(TimeZone.getTimeZone(reminderConfig.getTimeZone()));
        int hour = rightNow.get(Calendar.HOUR);
        int minute = rightNow.get(Calendar.MINUTE);
        int totalMinutes = hour * MINUTES_OF_HOUR + minute;
        return MINUTES_OF_DAY - totalMinutes;
    }

}
