package com.bulletjournal.controller.models;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.Assert.assertNotNull;

/**
 * Tests {@link TransactionViewTest}
 */
@ActiveProfiles("test")
public class TransactionViewTest {

    @Test
    public void getView() {
        Transaction view = Transaction.getView(new TransactionStub());
        assertNotNull(view.getPaymentTime());
    }

    private static class TransactionStub extends Transaction {
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
        public String getDate() {
            return "2020-06-07";
        }

        @Override
        public String getTime() {
            return "00:00";
        }

        @Override
        public String getTimezone() {
            return "America/Los_Angeles";
        }
    }
}