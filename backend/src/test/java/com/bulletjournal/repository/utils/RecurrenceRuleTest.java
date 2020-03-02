package com.bulletjournal.repository.utils;

import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.recur.RecurrenceRule;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;
import org.junit.Test;

/**
 * https://github.com/dmfs/lib-recur
 */
public class RecurrenceRuleTest {

    @Test
    public void testRule() throws Exception {
        RecurrenceRule rule = new RecurrenceRule("FREQ=YEARLY;BYMONTHDAY=23;BYMONTH=5");
        DateTime start = new DateTime(1982, 4 /* 0-based month numbers! */, 23);
        RecurrenceRuleIterator it = rule.iterator(start);
        int maxInstances = 100; // limit instances for rules that recur forever
        while (it.hasNext() && (!rule.isInfinite() || maxInstances-- > 0)) {
            DateTime nextInstance = it.nextDateTime();
            System.out.println(nextInstance);
        }
    }
}
