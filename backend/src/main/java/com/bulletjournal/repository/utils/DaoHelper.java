package com.bulletjournal.repository.utils;

import com.bulletjournal.daemon.models.ReminderRecord;
import com.bulletjournal.repository.models.Task;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

public class DaoHelper {

    public static <T> void updateIfPresent(Boolean isPresent, T value, Consumer<T> getter) {
        if (isPresent) {
            getter.accept(value);
        }
    }

    // For recurring task, return list of ReminderRecord in [startTime, endTime]
    // For one-time task, return list of single or zero ReminderRecord
    public List<ReminderRecord> getReminderRecords(Task task, ZonedDateTime startTime, ZonedDateTime endTime) {
        return Collections.emptyList();
    }
}
