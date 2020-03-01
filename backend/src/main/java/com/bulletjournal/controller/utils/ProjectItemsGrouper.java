package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.repository.models.Transaction;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProjectItemsGrouper {

    /*
     * Convert list of transactions to a Map and convert map into List of Project Items
     *
     * @transactions List<Transaction> - List of Transactions
     */
    public static List<ProjectItems> groupTransactionsByDate(List<Transaction> transactions) {
        Map<ZonedDateTime, List<Transaction>> map = getCandidateDates(transactions);
        List<ProjectItems> projectItems = new ArrayList<>();
        map.keySet().forEach(dateTime -> {
            ProjectItems projectItem = new ProjectItems();
            projectItem.setDate(ZonedDateTimeHelper.getDateFromZoneDateTime(dateTime));
            projectItem.setDayOfWeek(dateTime.getDayOfWeek());
            projectItem.setTransactions(map.get(dateTime));
            projectItems.add(projectItem);
        });
        return projectItems;
    }

    /*
     * Convert list of transactions to a Map with Key as ZonedDateTime
     *
     * @transactions List<Transaction> - List of Transactions
     * @retVal Map<ZonedDateTime, List<Transaction>>
     */
    public static Map<ZonedDateTime, List<Transaction>> getCandidateDates(List<Transaction> transactions) {
        Map<ZonedDateTime, List<Transaction>> map = new HashMap<>();
        for (Transaction transaction : transactions) {
            ZonedDateTime zonedDateTime =
                    ZonedDateTimeHelper.convertDateOnly(transaction.getDate(), transaction.getTimezone());
            map.computeIfAbsent(zonedDateTime, x -> new ArrayList<>()).add(transaction);
        }
        return map;
    }
}
