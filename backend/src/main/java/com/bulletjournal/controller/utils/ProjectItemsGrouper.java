package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.Transaction;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProjectItemsGrouper {

    /*
     * Convert list of transactions to a <ZonedDateTime, Transaction List> Map
     *
     * @transactions Map<ZonedDateTime, List<Transaction>> - List of Transactions
     */
    public static Map<ZonedDateTime, List<Transaction>> groupTransactionsByDate(List<Transaction> transactions) {
        Map<ZonedDateTime, List<Transaction>> map = new HashMap<>();
        for (Transaction transaction : transactions) {
            ZonedDateTime zonedDateTime =
                    ZonedDateTimeHelper.convertDateOnly(transaction.getDate(), transaction.getTimezone());
            map.computeIfAbsent(zonedDateTime, x -> new ArrayList<>()).add(transaction);
        }
        return map;
    }

    /*
     * Convert list of tasks to a <ZonedDateTime, Task List> Map
     *
     * @tasks Map<ZonedDateTime, List<Task>> - List of Tasks
     */
    public static Map<ZonedDateTime, List<Task>> groupTasksByDate(List<Task> tasks) {
        Map<ZonedDateTime, List<Task>> map = new HashMap<>();
        for (Task task : tasks) {
            ZonedDateTime zonedDateTime =
                    ZonedDateTimeHelper.convertDateOnly(task.getDueDate(), task.getTimezone());
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
            transactions.sort((t1, t2) -> {

                // Sort transaction by end time
                ZonedDateTime z1 = ZonedDateTimeHelper.getEndTime(t1.getDate(), t1.getTime(), t1.getTimezone());
                ZonedDateTime z2 = ZonedDateTimeHelper.getEndTime(t2.getDate(), t2.getTime(), t2.getTimezone());
                return z2.compareTo(z1);
            });
            projectItem.setTransactions(transactions.stream().map(Transaction::toPresentationModel).collect(Collectors.toList()));
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

        tasksMap.keySet().forEach(zonedDateTime -> {
            ProjectItems projectItem = mergedMap.getOrDefault(zonedDateTime, new ProjectItems());
            projectItem.setDate(ZonedDateTimeHelper.getDate(zonedDateTime));
            projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
            List<Task> tasks = tasksMap.get(zonedDateTime);
            tasks.sort((t1, t2) -> {

                // Sort task by end time
                ZonedDateTime z1 = ZonedDateTimeHelper.getEndTime(t1.getDueDate(), t1.getDueTime(), t1.getTimezone());
                ZonedDateTime z2 = ZonedDateTimeHelper.getEndTime(t2.getDueDate(), t2.getDueTime(), t2.getTimezone());
                return z2.compareTo(z1);
            });
            projectItem.setTasks(tasks.stream().map(Task::toPresentationModel).collect(Collectors.toList()));
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
            notes.sort((t1, t2) -> t2.getUpdatedAt().compareTo(t1.getUpdatedAt()));
            projectItem.setNotes(notes.stream().map(Note::toPresentationModel).collect(Collectors.toList()));
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
        entries.sort((e1, e2) -> e2.getKey().compareTo(e1.getKey()));
        List<ProjectItems> projectItems = new ArrayList<>();
        entries.forEach(e -> {
            projectItems.add(e.getValue());
        });
        return projectItems;
    }
}
