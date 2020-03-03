package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.controller.models.Transaction;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
     * Convert list of transactions to a Map and convert map into List of Project Items
     *
     * @transactions Map<ZonedDateTime, List<Transaction>> - List of Transactions
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
     * Merge transaction list and task list into one Map
     *
     * @transactions Map<ZonedDateTime, List<Transaction>> - List of Transactions
     */
    public static Map<ZonedDateTime, ProjectItems> mergeMap(@Nullable Map<ZonedDateTime, List<Task>> tasksMap,
                                                            @Nullable Map<ZonedDateTime, List<Transaction>> transactionsMap) {
        Map<ZonedDateTime, ProjectItems> mergedMap = new HashMap<>();

        if (transactionsMap != null) {
            transactionsMap.keySet().forEach(zonedDateTime -> {
                ProjectItems projectItem = new ProjectItems();
                projectItem.setDate(ZonedDateTimeHelper.getDateFromZoneDateTime(zonedDateTime));
                projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
                List<Transaction> transactions = transactionsMap.get(zonedDateTime);
                transactions.sort((t1, t2) -> {

                    // Sort transaction by end time
                    ZonedDateTime z1 = IntervalHelper.getEndTime(t1.getDate(), t1.getTime(), t1.getTimezone());
                    ZonedDateTime z2 = IntervalHelper.getEndTime(t2.getDate(), t2.getTime(), t2.getTimezone());
                    return z1.compareTo(z2);
                });
                projectItem.setTransactions(transactions);
                mergedMap.put(zonedDateTime, projectItem);
            });
        }

        if (tasksMap != null) {
            tasksMap.keySet().forEach(zonedDateTime -> {
                ProjectItems projectItem = mergedMap.getOrDefault(zonedDateTime, new ProjectItems());
                projectItem.setDate(ZonedDateTimeHelper.getDateFromZoneDateTime(zonedDateTime));
                projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
                List<Task> tasks = tasksMap.get(zonedDateTime);
                tasks.sort((t1, t2) -> {

                    // Sort task by end time
                    ZonedDateTime z1 = IntervalHelper.getEndTime(t1.getDueDate(), t1.getDueTime(), t1.getTimezone());
                    ZonedDateTime z2 = IntervalHelper.getEndTime(t2.getDueDate(), t2.getDueTime(), t2.getTimezone());
                    return z1.compareTo(z2);
                });
                projectItem.setTasks(tasksMap.get(zonedDateTime));
                mergedMap.put(zonedDateTime, projectItem);
            });
        }

        return mergedMap;
    }



    public static List<ProjectItems> getProjectItems(@NotNull Map<ZonedDateTime, ProjectItems> mergedMap) {
        List<ProjectItems> projectItems = new ArrayList<>();
        for (Map.Entry<ZonedDateTime, ProjectItems> entry : mergedMap.entrySet()) {
            projectItems.add(entry.getValue());
        }
        return projectItems;
    }
}
