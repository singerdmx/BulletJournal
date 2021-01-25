package com.bulletjournal.repository.utils;

import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.Transaction;
import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * Tests {@link DaoHelperTest}
 */
@ActiveProfiles("test")
public class DaoHelperTest {

    @Test
    public void recoverTaskWithDueDateTime() {
        ProjectStub projectStub = new ProjectStub();
        ReminderSetting reminderSetting = new ReminderSetting(null, null, 1);

        Task task = TestHelpers.getTaskRepoModel(1L, "Michael_Zhou", null, null, "America/Los_Angeles", "t1", 0, projectStub, null, reminderSetting);
        task.setRecurrenceRule("DTSTART:20200825T070000ZRRULE:FREQ=WEEKLY;BYDAY=TU;INTERVAL=1");
        long epochMillis = 1595694480000L; // 2020-7-25 9:28 PST
        Task clonedTask = DaoHelper.cloneTaskWithDueDateTime(task, epochMillis);

        assertEquals(task.getId(), clonedTask.getId());
        assertEquals("2020-07-25", clonedTask.getDueDate());
        assertEquals("09:28", clonedTask.getDueTime());
    }

    @Test
    public void getRecurringTransaction() {
        ProjectStub projectStub = new ProjectStub();
        Transaction transaction = TestHelpers.getTransactionRepoModel(1L, "transaction1", projectStub, "Michael_Zhou", 1.0, null, null, "America/Los_Angeles", 1);
        transaction.setRecurrenceRule("DTSTART:20200825T070000ZRRULE:FREQ=WEEKLY;BYDAY=MO;INTERVAL=1");
        ZonedDateTime start = ZonedDateTime.parse("2021-01-04T00:00:00+05:30[America/Los_Angeles]");
        ZonedDateTime end = ZonedDateTime.parse("2021-01-11T23:59:59+05:30[America/Los_Angeles]");
        List<Transaction> transactions = DaoHelper.getRecurringTransaction(transaction, start, end);
        assertNotNull(transactions);
        assertEquals(transactions.size(), 2);
        assertEquals("2021-01-04", transactions.get(0).getDate());
        assertEquals("2021-01-11", transactions.get(1).getDate());
    }

    /*
     * Stub class for Project
     */
    private static class ProjectStub extends Project {
        @Override
        public Long getId() {
            return 1L;
        }
    }
}