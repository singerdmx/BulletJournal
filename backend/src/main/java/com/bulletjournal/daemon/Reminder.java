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
        this.loadPrevReminderRecords();
        this.loadNextReminderRecords();
        LOGGER.info(reminderConfig.toString());
        LOGGER.info("Reminder first delay minute: " + this.getFirstDelayMinutes());
    }

    public void loadNextReminderRecords() {
        this.loadReminderRecords(reminderConfig.getLoadNextHours());
    }

    public void loadPrevReminderRecords() {
        this.loadReminderRecords(reminderConfig.getLoadPrevHours());
    }

    private void loadReminderRecords(int hours) {
    }

    private long getFirstDelayMinutes() {
        Calendar rightNow = Calendar.getInstance(TimeZone.getTimeZone(reminderConfig.getTimeZone()));
        int hour = rightNow.get(Calendar.HOUR);
        int minute = rightNow.get(Calendar.MINUTE);
        int totalMinutes = hour * MINUTES_OF_HOUR + minute;
        return MINUTES_OF_DAY - totalMinutes;
    }

}
