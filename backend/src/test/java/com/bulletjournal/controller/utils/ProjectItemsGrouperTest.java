package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.controller.models.Transaction;
import com.bulletjournal.repository.models.Project;
import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Tests {@link ProjectItemsGrouperTest}
 */
@ActiveProfiles("test")
public class ProjectItemsGrouperTest {

    @Test
    public void testGroupTransactionsByDate() {
        List<Transaction> transactions = new ArrayList<>();
        ProjectStub projectStub = new ProjectStub();
        Transaction t1 = new Transaction(1L, "t1", projectStub, "Michael_Zhou", 1.0, "2020-03-07", null, "America/Los_Angeles", 0);
        Transaction t2 = new Transaction(1L, "t2", projectStub, "Michael_Zhou", 1.0, "2020-03-04", null, "America/Los_Angeles", 0);
        Transaction t3 = new Transaction(1L, "t3", projectStub, "Michael_Zhou", 1.0, "2020-03-05", null, "America/Los_Angeles", 0);
        Transaction t4 = new Transaction(1L, "t4", projectStub, "Michael_Zhou", 1.0, "2020-03-06", null, "America/Los_Angeles", 0);

        transactions.add(t1);
        transactions.add(t2);
        transactions.add(t3);
        transactions.add(t4);

        Map<ZonedDateTime, List<Transaction>> map = ProjectItemsGrouper.groupTransactionsByDate(transactions);
        assertEquals(4, map.size());
        for (Map.Entry<ZonedDateTime, List<Transaction>> entry : map.entrySet()) {
            List<Transaction> t = entry.getValue();
            assertTrue(transactions.contains(t.get(0)));
        }
    }

    @Test
    public void testGroupTasksByDate() {
        List<Task> tasks = new ArrayList<>();
        ProjectStub projectStub = new ProjectStub();
        ReminderSetting reminderSetting = new ReminderSetting();
        Task t1 = new Task(1L, "Michael_Zhou", "2020-03-03", null, "America/Los_Angeles", "t1", 0, projectStub, null, reminderSetting);
        Task t2 = new Task(1L, "Michael_Zhou", "2020-03-04", null, "America/Los_Angeles", "t2", 0, projectStub, null, reminderSetting);
        Task t3 = new Task(1L, "Michael_Zhou", "2020-03-05", null, "America/Los_Angeles", "t3", 0, projectStub, null,  reminderSetting);
        Task t4 = new Task(1L, "Michael_Zhou", "2020-03-06", null, "America/Los_Angeles", "t4", 0, projectStub, null, reminderSetting);

        tasks.add(t1);
        tasks.add(t2);
        tasks.add(t3);
        tasks.add(t4);

        Map<ZonedDateTime, List<Task>> map = ProjectItemsGrouper.groupTasksByDate(tasks);
        assertEquals(4, map.size());
        for (Map.Entry<ZonedDateTime, List<Task>> entry : map.entrySet()) {
            List<Task> t = entry.getValue();
            assertTrue(tasks.contains(t.get(0)));
        }
    }

    /*
     *  task 1         Timestamp: 2020-03-03
     *  task 2         Timestamp: 2020-03-04
     *  transaction 1  Timestamp: 2020-03-07
     *  transaction 2  Timestamp: 2020-03-04
     *
     *  Result:
     *        2020-03-03 - task1
     *        2020-03-04 - task2 transaction2
     *        2020-03-07 - transaction1
     */
    @Test
    public void mergeMap() {
        Map<ZonedDateTime, List<Task>> taskMap = new HashMap<>();
        Map<ZonedDateTime, List<Transaction>> transactionMap = new HashMap<>();

        ProjectStub projectStub = new ProjectStub();
        ReminderSetting reminderSetting = new ReminderSetting();

        Transaction transaction1 = new Transaction(1L, "t1", projectStub, "Michael_Zhou", 1.0, "2020-03-07", null, "America/Los_Angeles", 0);
        Transaction transaction2 = new Transaction(1L, "t2", projectStub, "Michael_Zhou", 1.0, "2020-03-04", null, "America/Los_Angeles", 0);

        Task task1 = new Task(1L, "Michael_Zhou", "2020-03-03", null, "America/Los_Angeles", "t1", 0, projectStub, null,  reminderSetting);
        Task task2 = new Task(1L, "Michael_Zhou", "2020-03-04", null, "America/Los_Angeles", "t2", 0, projectStub, null, reminderSetting);

        ZonedDateTime time1 = IntervalHelper.getStartTime(transaction1.getDate(), transaction1.getTime(), transaction1.getTimezone());
        ZonedDateTime time2 = IntervalHelper.getStartTime(transaction2.getDate(), transaction2.getTime(), transaction2.getTimezone());
        ZonedDateTime time3 = IntervalHelper.getStartTime(task1.getDueDate(), task1.getDueTime(), task1.getTimezone());
        ZonedDateTime time4 = IntervalHelper.getStartTime(task2.getDueDate(), task2.getDueTime(), task2.getTimezone());

        transactionMap.computeIfAbsent(time1, t -> new ArrayList<>()).add(transaction1);
        transactionMap.computeIfAbsent(time2, t -> new ArrayList<>()).add(transaction2);

        taskMap.computeIfAbsent(time3, t -> new ArrayList<>()).add(task1);
        taskMap.computeIfAbsent(time4, t -> new ArrayList<>()).add(task2);

        Map<ZonedDateTime, ProjectItems> map = ProjectItemsGrouper.mergeMap(taskMap, transactionMap);
        assertEquals(3, map.size());

        ProjectItems p1 = map.get(time1);
        ProjectItems p2 = map.get(time2);
        ProjectItems p3 = map.get(time3);
        ProjectItems p4 = map.get(time4);

        assertEquals(p2, p4);
        assertEquals(1, p1.getTransactions().size());
        assertEquals(transaction1, p1.getTransactions().get(0));

        assertEquals(1, p2.getTransactions().size());
        assertEquals(transaction2, p2.getTransactions().get(0));

        assertEquals(1, p3.getTasks().size());
        assertEquals(task1, p3.getTasks().get(0));

        assertEquals(1, p2.getTasks().size());
        assertEquals(task2, p2.getTasks().get(0));
    }

    /*
     *  task 1         Timestamp: 2020-03-03
     *  task 2         Timestamp: 2020-03-04
     *  transaction 1  Timestamp: 2020-03-07
     *  transaction 2  Timestamp: 2020-03-04
     *
     *  Result: task1 -> task2 -> transaction2 -> transaction1
     */
    @Test
    public void getProjectItems() {
        ProjectStub projectStub = new ProjectStub();
        ReminderSetting reminderSetting = new ReminderSetting();

        Transaction transaction1 = new Transaction(1L, "t1", projectStub, "Michael_Zhou", 1.0, "2020-03-07", null, "America/Los_Angeles", 0);
        Transaction transaction2 = new Transaction(1L, "t2", projectStub, "Michael_Zhou", 1.0, "2020-03-04", null, "America/Los_Angeles", 0);

        Task task1 = new Task(1L, "Michael_Zhou", "2020-03-03", null, "America/Los_Angeles", "t1", 0, projectStub, null, reminderSetting);
        Task task2 = new Task(1L, "Michael_Zhou", "2020-03-04", null, "America/Los_Angeles", "t2", 0, projectStub, null, reminderSetting);

        ZonedDateTime time1 = IntervalHelper.getStartTime(transaction1.getDate(), transaction1.getTime(), transaction1.getTimezone());
        ZonedDateTime time2 = IntervalHelper.getStartTime(transaction2.getDate(), transaction2.getTime(), transaction2.getTimezone());
        ZonedDateTime time3 = IntervalHelper.getStartTime(task1.getDueDate(), task1.getDueTime(), task1.getTimezone());
        ZonedDateTime time4 = IntervalHelper.getStartTime(task2.getDueDate(), task2.getDueTime(), task2.getTimezone());

        List<Transaction> tr1 = new ArrayList<>();
        tr1.add(transaction1);
        ProjectItems p1 = new ProjectItems();
        p1.setTransactions(tr1);
        p1.setDate(transaction1.getDate());
        p1.setDayOfWeek(time1.getDayOfWeek());

        List<Transaction> tr2 = new ArrayList<>();
        tr2.add(transaction2);
        ProjectItems p2 = new ProjectItems();
        p2.setTransactions(tr2);
        p2.setDate(transaction2.getDate());
        p2.setDayOfWeek(time2.getDayOfWeek());

        List<Task> ta1 = new ArrayList<>();
        ta1.add(task1);
        ProjectItems p3 = new ProjectItems();
        p3.setTasks(ta1);
        p3.setDate(task1.getDueDate());
        p3.setDayOfWeek(time3.getDayOfWeek());

        List<Task> ta2 = new ArrayList<>();
        ta2.add(task2);
        p2.setTasks(ta2);
        p2.setDate(task2.getDueDate());
        p2.setDayOfWeek(time4.getDayOfWeek());

        Map<ZonedDateTime, ProjectItems> map = new HashMap<>();
        map.put(time1, p1);
        map.put(time2, p2);
        map.put(time3, p3);

        List<ProjectItems> projectItems = ProjectItemsGrouper.getSortedProjectItems(map);

        assertEquals(3, projectItems.size());
        assertEquals(task1.getDueDate(), projectItems.get(0).getDate());
        assertEquals(task2.getDueDate(), projectItems.get(1).getDate());
        assertEquals(transaction1.getDate(), projectItems.get(2).getDate());
        assertEquals(transaction2.getDate(), projectItems.get(1).getDate());
        assertEquals(1, projectItems.get(0).getTasks().size());
        assertEquals(1, projectItems.get(1).getTransactions().size());
        assertEquals(1, projectItems.get(1).getTasks().size());
        assertEquals(1, projectItems.get(2).getTransactions().size());
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