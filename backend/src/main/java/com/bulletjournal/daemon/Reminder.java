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
import com.bulletjournal.util.MathUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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

    public List<ReminderRecord> getTasksAssignedThatNeedsWebPopupReminder(
            String requester, ZonedDateTime startTime, ZonedDateTime endTime) {
        // task assignees match requester
        List<ReminderRecord> res = concurrentHashMap.entrySet().stream()
                .filter(e -> e.getValue().getAssignees().contains(requester)
                        && e.getKey().getTimestampSecond() <= endTime.toEpochSecond() &&
                        startTime.toEpochSecond() <= e.getKey().getTimestampSecond())
                .map(e -> e.getKey()).distinct().collect(Collectors.toList());
        return res;
    }

    private void initLoad() {
        LOGGER.info("initLoad");
        ZonedDateTime start = ZonedDateTime.now().minus(reminderConfig.getLoadPrevSeconds(), ChronoUnit.SECONDS);
        ZonedDateTime end = ZonedDateTime.now().plus(reminderConfig.getLoadNextSeconds(), ChronoUnit.SECONDS);
        this.scheduleReminderRecords(Pair.of(start, end));
        LOGGER.info("initLoad completed");
    }

    private void cronJob() {
        LOGGER.info("This is Reminder daily cronJob");
        this.purge(this.reminderConfig.getPurgePrevSeconds());

        this.scheduleReminderRecords(this.reminderConfig.getLoadNextSeconds());
    }

    /***
     * called by controller who created or updated task
     * @param tasks
     */
    public void generateTaskReminder(List<Task> tasks) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.getInterval(SECONDS_OF_DAY, reminderConfig.getTimeZone());

        tasks.forEach(t -> {
            LOGGER.info("generateTaskReminder {}", t);
            DaoHelper.getReminderRecordMap(t, interval.getFirst(), interval.getSecond()).forEach((e, clonedTask) -> {
                        LOGGER.info("getReminderRecords {}", e);
                        if (!concurrentHashMap.containsKey(e)) {
                            LOGGER.info("getReminderRecords in map: {}", e);
                            long delay = getJitterDelay(e);
                            if (delay > 0) {
                                LOGGER.info("Schedule New Job:" + e.toString() + "\t delay=" + delay);
                                executorService.schedule(() -> this.process(e), delay, TimeUnit.MILLISECONDS);
                            }
                        }
                        concurrentHashMap.put(e, clonedTask);
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
            long delay = getJitterDelay(k);
            if (!concurrentHashMap.containsKey(k) && delay > 0) {
                LOGGER.info("Schedule New Job:" + k.toString() + "\t delay=" + delay);
                executorService.schedule(() -> this.process(k), delay, TimeUnit.MILLISECONDS);
                concurrentHashMap.put(k, v);
            }
        });
    }

    private long getJitterDelay(ReminderRecord reminderRecord) {
        long delay = reminderRecord.getTimestampSecond() - ZonedDateTime.now().toEpochSecond();
        delay *= 1000;
        delay -= MathUtil.getRandomNumber(200L, SCHEDULE_BUFF_SECONDS * 1000);
        return delay;
    }

    private void scheduleReminderRecords(long seconds) {
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.getInterval(seconds, reminderConfig.getTimeZone());
        this.scheduleReminderRecords(interval);
    }

    private void process(final ReminderRecord record) {
        LOGGER.info("process record=" + record.toString());
        Pair<ZonedDateTime, ZonedDateTime> interval = ZonedDateTimeHelper.getInterval(VERIFY_BUFF_SECONDS, reminderConfig.getTimeZone());
        taskRepository.findById(record.getId()).ifPresent(task -> {
            if (filterInvalidTask(record, interval.getFirst(), interval.getSecond(), task)) {
                LOGGER.info("Push notification record {}", record);
                fillDueDateTimeForRecurringTask(task, record);
                messagingService.sendTaskDueNotificationAndEmailToUsers(Collections.singletonList(task));
            }
        });
    }

    private void fillDueDateTimeForRecurringTask(Task task, ReminderRecord reminderRecord) {
        if (!task.hasRecurrenceRule()) {
            return;
        }
        Task cachedTask = concurrentHashMap.get(reminderRecord);
        if (cachedTask == null) {
            LOGGER.error("Cached task id {} doesn't exist in ConcurrentHashMap", task.getId());
            return;
        }
        task.setDueDate(cachedTask.getDueDate());
        task.setDueTime(cachedTask.getDueTime());
    }

    private boolean filterInvalidTask(ReminderRecord record, ZonedDateTime startTime, ZonedDateTime endTime, Task task) {
        Map<ReminderRecord, Task> map = DaoHelper.getReminderRecordMap(task, startTime, endTime);
        if (map.keySet().contains(record)) {
            return true;
        }
        concurrentHashMap.remove(record);
        return false;
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getRemindingTasks(
            List<ReminderRecord> reminderRecords, ZonedDateTime startTime) {
        if (reminderRecords.isEmpty()) {
            return Collections.emptyList();
        }
        ZonedDateTime endTime = ZonedDateTime.now().plusHours(2);
        // batch get tasks using task ids
        Map<Long, Task> taskMap = this.taskRepository.findAllById(
                reminderRecords.stream().map(ReminderRecord::getId).distinct().collect(Collectors.toList()))
                .stream().filter(Objects::nonNull).collect(Collectors.toMap(Task::getId, t -> t));
        List<Task> res = reminderRecords.stream().filter(record -> {
            Task task = taskMap.get(record.getId());
            if (task == null) {
                return false;
            }
            return filterInvalidTask(record, startTime, endTime, task);
        }).map(record -> {
            Task task = taskMap.get(record.getId());
            if (task.getRecurrenceRule() != null) {
                List<Task> l = DaoHelper.getRecurringTask(task, startTime, endTime);
                if (!l.isEmpty()) {
                    task = l.get(0);
                } else {
                    LOGGER.error("No recurring task for {} between {} and {}", task, startTime, endTime);
                }
            }
            return task;
        }).collect(Collectors.toList());
        for (Task t : res) {
            LOGGER.info("t.getReminderDateTime() {} {}", t.getReminderDateTime(), Timestamp.valueOf(ZonedDateTime.now()
                    .toLocalDateTime()));
        }
        return res.stream().filter(t -> t.getReminderDateTime().before(Timestamp.valueOf(ZonedDateTime.now()
                .toLocalDateTime()))).collect(Collectors.toList());
    }
}
