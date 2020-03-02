package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.Project;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.controller.models.Transaction;

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
    public static Map<ZonedDateTime, ProjectItems> mergeMap(Map<ZonedDateTime, List<Transaction>> transactionsMap, Map<ZonedDateTime, List<Task>> tasksMap) {
        Map<ZonedDateTime, ProjectItems> mergedMap = new HashMap<>();
        transactionsMap.keySet().forEach(zonedDateTime -> {
            ProjectItems projectItem = new ProjectItems();
            projectItem.setDate(ZonedDateTimeHelper.getDateFromZoneDateTime(zonedDateTime));
            projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
            projectItem.setTransactions(transactionsMap.get(zonedDateTime));
            mergedMap.put(zonedDateTime, projectItem);
        });

        tasksMap.keySet().forEach(zonedDateTime -> {
            ProjectItems projectItem = mergedMap.getOrDefault(zonedDateTime, new ProjectItems());
            projectItem.setDate(ZonedDateTimeHelper.getDateFromZoneDateTime(zonedDateTime));
            projectItem.setDayOfWeek(zonedDateTime.getDayOfWeek());
            projectItem.setTasks(tasksMap.get(zonedDateTime));
            mergedMap.put(zonedDateTime, projectItem);
        });

        return mergedMap;
    }

    public static List<ProjectItems> getProjectItemsListFromMap(Map<ZonedDateTime, ProjectItems> mergedMap) {
        return mergedMap
    }
}
