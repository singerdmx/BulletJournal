package com.bulletjournal.controller.models;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.Assert.*;

/**
 * Tests {@link TaskViewTest}
 */
@ActiveProfiles("test")
public class TaskViewTest {

    @Test
    public void getView() {
        Task view = Task.getView(new TaskStub());
        assertNotNull(view.getStartTime());
        assertNotNull(view.getEndTime());
    }

    @Test
    public void getViewNullDueDate() {
        Task view = Task.getView(new TaskStubNullDueDate());
        assertNull(view.getStartTime());
        assertNull(view.getEndTime());
    }

    @Test
    public void getViewNullDueTime() {
        Task view = Task.getView(new TaskStubNullDueTime());
        assertNotNull(view.getStartTime());
        assertNotNull(view.getEndTime());
    }

    @Test
    public void getViewNullDuration() {
        Task view = Task.getView(new TaskStubNullDuration());
        assertNotNull(view.getStartTime());
        assertNotNull(view.getEndTime());
        assertEquals(view.getStartTime(), view.getEndTime());
    }

    @Test
    public void setEndTime() {
        Task view = new Task();
        view.setEndTime(2L);
        assertEquals(Long.valueOf(2L), view.getEndTime());
    }

    private static class TaskStubNullDueDate extends TaskStubNullDueTime {
        @Override
        public String getDueDate() {
            return null;
        }
    }

    private static class TaskStubNullDueTime extends TaskStub {
        @Override
        public String getDueTime() {
            return null;
        }
    }

    private static class TaskStubNullDuration extends TaskStub {
        @Override
        public Integer getDuration() {
            return null;
        }
    }

    private static class TaskStub extends Task {
        @Override
        public Long getId() {
            return 1L;
        }

        @Override
        public String getName() {
            return "TaskStub";
        }

        @Override
        public Long getProjectId() {
            return 1L;
        }

        @Override
        public User getOwner() {
            return new User("testUser");
        }

        @Override
        public Integer getDuration() {
            return 60;
        }

        @Override
        public String getDueDate() {
            return "2020-06-07";
        }

        @Override
        public String getDueTime() {
            return "00:00";
        }

        @Override
        public String getTimezone() {
            return "America/Los_Angeles";
        }
    }
}