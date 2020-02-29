package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.repository.models.Transaction;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ProjectItemsGrouper {

    private static final String DATE_DELIMITER = "-";

    /*
     * Group transactions by date and add to project item. If no transaction happened on the date,
     * the date will be skipped.
     *
     * @projectItems List<ProjectItems> - Project item List will get result
     * @transactions List<Transaction> - Transaction list
     * @dates List<ZoneDateTime> - List of dates
     */
    public static void groupTransactionsByDate(
            List<ProjectItems> projectItems, List<Transaction> transactions, List<ZonedDateTime> dates) {
        for (ZonedDateTime date : dates) {
            ProjectItems projectItem = new ProjectItems();
            projectItem.setDate(getDateFromZoneDateTime(date));
            List<Transaction> transactionOnDate = getTransactionOn(transactions, projectItem.getDate());
            if (!transactionOnDate.isEmpty()) {
                projectItem.setTransactions(transactionOnDate);
                projectItems.add(projectItem);
            }
        }
    }

    private static List<Transaction> getTransactionOn(List<Transaction> transactions, String date) {
        return transactions.stream().filter(t -> t.getDate().equals(date)).collect(Collectors.toList());
    }

    /*
     * Convert ZoneDateTime to Date String
     */
    private static String getDateFromZoneDateTime(ZonedDateTime zonedDateTime) {
        return zonedDateTime.getYear() + DATE_DELIMITER +
                zonedDateTime.getMonthValue() + DATE_DELIMITER +
                zonedDateTime.getDayOfMonth();
    }
}
