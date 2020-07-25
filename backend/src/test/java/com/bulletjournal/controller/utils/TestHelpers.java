package com.bulletjournal.controller.utils;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.ledger.TransactionType;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.Transaction;
import com.google.common.collect.ImmutableList;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class TestHelpers {

    @SafeVarargs
    public static <T> void assertIfContains(List<T> container, T... objects) {
        for (T object : objects) {
            assertTrue(container.contains(object));
        }
    }

    @SafeVarargs
    public static <T> void assertIfNotContains(List<T> container, T... objects) {
        for (T object : objects) {
            assertFalse(container.contains(object));
        }
    }

    public static <T> HttpEntity actAsOtherUser(T body, String username, String... eTags) {
        final HttpHeaders headers = new HttpHeaders();
        headers.set(UserClient.USER_NAME_KEY, username);

        if (eTags.length > 0)
            headers.setIfNoneMatch(eTags[0]);

        if (body == null) {
            return new HttpEntity<>(headers);
        }

        return new HttpEntity<>(body, headers);
    }

    public static Task getTaskRepoModel(Long id,
                                        String assignee,
                                        String dueDate,
                                        String dueTime,
                                        String timezone,
                                        String name,
                                        Integer duration,
                                        Project project,
                                        List<Long> labels,
                                        ReminderSetting reminderSetting) {
        Task task = new Task();
        task.setId(id);
        task.setAssignees(ImmutableList.of(assignee));
        task.setDueDate(dueDate);
        task.setDueTime(dueTime);
        task.setTimezone(timezone);
        task.setName(name);
        task.setDuration(duration);
        task.setProject(project);
        task.setLabels(labels);
        task.setReminderSetting(reminderSetting);
        task.setCreatedAt(Timestamp.from(Instant.now()));
        task.setUpdatedAt(Timestamp.from(Instant.now()));
        return task;
    }


    public static Transaction getTransactionRepoModel(Long id,
                                                      String name,
                                                      Project project,
                                                      String payer,
                                                      Double amount,
                                                      String date,
                                                      String time,
                                                      String timezone,
                                                      Integer transactionType) {
        Transaction transaction = new Transaction();
        transaction.setId(id);
        transaction.setName(name);
        transaction.setProject(project);
        transaction.setPayer(payer);
        transaction.setAmount(amount);
        transaction.setDate(date);
        transaction.setTime(time);
        transaction.setTimezone(timezone);
        transaction.setTransactionType(TransactionType.getType(transactionType));
        transaction.setCreatedAt(Timestamp.from(Instant.now()));
        transaction.setUpdatedAt(Timestamp.from(Instant.now()));
        return transaction;
    }
}
