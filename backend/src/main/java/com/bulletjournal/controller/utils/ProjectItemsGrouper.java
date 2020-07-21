package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.repository.models.AuditModel;
import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.Transaction;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class ProjectItemsGrouper {

    public static final Comparator<Transaction> TRANSACTION_COMPARATOR = (t1, t2) -> {

        // Sort transaction by date time
        ZonedDateTime z1 = ZonedDateTimeHelper.getEndTime(t1.getDate(), t1.getTime(), t1.getTimezone());
        ZonedDateTime z2 = ZonedDateTimeHelper.getEndTime(t2.getDate(), t2.getTime(), t2.getTimezone());
        return z1.compareTo(z2);
    };
    public static final Comparator<Task> TASK_COMPARATOR = (t1, t2) -> {
        if (!t1.hasDueDate() && !t2.hasDueDate()) {
            return Long.compare(t1.getId(), t2.getId());
        }
        if (!t1.hasDueDate()) {
            return 1;
        }
        if (!t2.hasDueDate()) {
            return -1;
        }

        // Sort task by due time
        ZonedDateTime z1 = ZonedDateTimeHelper.getEndTime(t1.getDueDate(), t1.getDueTime(), t1.getTimezone());
        ZonedDateTime z2 = ZonedDateTimeHelper.getEndTime(t2.getDueDate(), t2.getDueTime(), t2.getTimezone());
        return z1.compareTo(z2);
    };
    public static final Comparator<Note> NOTE_COMPARATOR = Comparator.comparing(AuditModel::getUpdatedAt);

    /*
     * Convert list of transactions to a <ZonedDateTime, Transaction List> Map
     *
     * @transactions Map<ZonedDateTime, List<Transaction>> - List of Transactions
     */
    public static Map<ZonedDateTime, List<Transaction>> groupTransactionsByDate(List<Transaction> transactions,
                                                                                String timezone) {
        Map<ZonedDateTime, List<Transaction>> map = new HashMap<>();
        for (Transaction transaction : transactions) {
            ZonedDateTime zonedDateTime =
                    ZonedDateTimeHelper.getDateInDifferentZone(transaction.getDate(), transaction.getTime(), transaction.getTimezone(), timezone);
            map.computeIfAbsent(zonedDateTime, x -> new ArrayList<>()).add(transaction);
        }
        return map;
    }

    /*
     * Convert list of tasks to a <ZonedDateTime, Task List> Map
     *
     * @tasks Map<ZonedDateTime, List<Task>> - List of Tasks
     */
    public static Map<ZonedDateTime, List<Task>> groupTasksByDate(List<Task> tasks,
                                                                  boolean keepTaskWithNoDueDate,
                                                                  String timezone) {
        Map<ZonedDateTime, List<Task>> map = new HashMap<>();
        for (Task task : tasks) {
            String dueDate = task.getDueDate();
            String dueTime = task.getDueTime();
            if (dueDate == null) {
                if (!keepTaskWithNoDueDate) {
                    continue;
                }
                ZonedDateTime deadline = ZonedDateTimeHelper.getNow(task.getTimezone());
                dueDate = deadline.format(ZonedDateTimeHelper.DATE_FORMATTER);
                dueTime = deadline.format(ZonedDateTimeHelper.TIME_FORMATTER);
            }
            ZonedDateTime zonedDateTime = ZonedDateTimeHelper
                    .getDateInDifferentZone(dueDate, dueTime, task.getTimezone(), timezone);
            map.computeIfAbsent(zonedDateTime, x -> new ArrayList<>()).add(task);
        }
        return map;
    }

    /*
     * Convert list of notes to a <ZonedDateTime, Note List> Map
     *
     * @notes Map<ZonedDateTime, List<Note>> - List of Notes
     */
    public static Map<ZonedDateTime, List<Note>> groupNotesByDate(List<Note> notes, String timezone) {
        Map<ZonedDateTime, List<Note>> map = new HashMap<>();
        if (notes.size() > 0) {
            ZonedDateTime zonedDateTime
                    = timezone == null ? ZonedDateTimeHelper.getNow() : ZonedDateTimeHelper.getNow(timezone);
            map.put(zonedDateTime, notes);
        }
        return map;
    }

    /*
     * Merge transactions map to target projectItems map
     *
     * @projectItems Map<ZonedDateTime, List<ProjectItems>> - List of ProjectItems
     */
    public static Map<ZonedDateTime, ProjectItems> mergeTransactionsMap(Map<ZonedDateTime, ProjectItems> mergedMap,
                                                                        @Nullable Map<ZonedDateTime, List<Transaction>> transactionsMap) {
        if (transactionsMap == null) {
            return mergedMap;
        }

        transactionsMap.keySet().forEach(zonedDateTime -> {
            ProjectItems projectItem = mergedMap.getOrDefault(zonedDateTime, new ProjectItems());
            projectItem.setDate(ZonedDateTimeHelper.getDate(zonedDateTime));
            projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
            List<Transaction> transactions = transactionsMap.get(zonedDateTime);
            transactions.sort(TRANSACTION_COMPARATOR);
            projectItem.setTransactions(transactions
                    .stream()
                    .map(t -> t.toPresentationModel())
                    .collect(Collectors.toList()));
            mergedMap.put(zonedDateTime, projectItem);
        });
        return mergedMap;
    }

    /*
     * Merge tasks map to target projectItems map
     *
     * @projectItems Map<ZonedDateTime, List<ProjectItems>> - List of ProjectItems
     */
    public static Map<ZonedDateTime, ProjectItems> mergeTasksMap(Map<ZonedDateTime, ProjectItems> mergedMap,
                                                                 @Nullable Map<ZonedDateTime, List<Task>> tasksMap) {
        if (tasksMap == null) {
            return mergedMap;
        }

        // Add an abstract toPresentationModel to parent class
        tasksMap.keySet().forEach(zonedDateTime -> {
            ProjectItems projectItem = mergedMap.getOrDefault(zonedDateTime, new ProjectItems());
            projectItem.setDate(ZonedDateTimeHelper.getDate(zonedDateTime));
            projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
            List<Task> tasks = tasksMap.get(zonedDateTime);
            tasks.sort(TASK_COMPARATOR);
            projectItem.setTasks(tasks.stream().map(t ->
                    t.toPresentationModel())
                    .collect(Collectors.toList()));
            mergedMap.put(zonedDateTime, projectItem);
        });
        return mergedMap;
    }

    /*
     * Merge notes map to target projectItems map
     *
     * @projectItems Map<ZonedDateTime, List<ProjectItems>> - List of ProjectItems
     */
    public static Map<ZonedDateTime, ProjectItems> mergeNotesMap(Map<ZonedDateTime, ProjectItems> mergedMap,
                                                                 @Nullable Map<ZonedDateTime, List<Note>> notesMap) {
        if (notesMap == null) {
            return mergedMap;
        }

        notesMap.keySet().forEach(zonedDateTime -> {
            ProjectItems projectItem = mergedMap.getOrDefault(zonedDateTime, new ProjectItems());
            projectItem.setDate(ZonedDateTimeHelper.getDate(zonedDateTime));
            projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
            List<Note> notes = notesMap.get(zonedDateTime);

            // Sort note by update time
            notes.sort(NOTE_COMPARATOR);
            projectItem.setNotes(notes.stream().map(n ->
                    n.toPresentationModel())
                    .collect(Collectors.toList()));
            mergedMap.put(zonedDateTime, projectItem);
        });
        return mergedMap;
    }

    /*
     * Convert <ZonedDateTime, ProjectItems> map into a list and sort the list by date
     *
     * @projectItems List<ProjectItems> - List of Project Items
     */
    public static List<ProjectItems> getSortedProjectItems(@NotNull Map<ZonedDateTime, ProjectItems> mergedMap) {
        List<Map.Entry<ZonedDateTime, ProjectItems>> entries = new ArrayList<>(mergedMap.entrySet());
        entries.sort(Map.Entry.comparingByKey());
        List<ProjectItems> projectItems = new ArrayList<>();
        entries.forEach(e -> projectItems.add(e.getValue()));
        return projectItems;
    }
}
