package com.bulletjournal.repository.utils;

import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.Assert.assertEquals;

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