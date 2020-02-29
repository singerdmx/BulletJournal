package com.bulletjournal.controller.utils;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import java.time.ZonedDateTime;

import static org.junit.Assert.*;

/**
 * Tests {@link ZonedDateTimeHelper}
 */
@ActiveProfiles("test")
public class ZonedDateTimeHelperTest {

    @Test
    public void convertDateTime() {
        String dateTime = "2020-02-20 11:05";
        String timezone = "America/Los_Angeles";

        ZonedDateTime zonedDateTime = ZonedDateTimeHelper.convertDateTime(dateTime, timezone);
        assertNotNull(zonedDateTime);
        assertEquals(2020, zonedDateTime.getYear());
        assertEquals(2, zonedDateTime.getMonthValue());
        assertEquals(20, zonedDateTime.getDayOfMonth());
        assertEquals(11, zonedDateTime.getHour());
        assertEquals(5, zonedDateTime.getMinute());
    }

    @Test
    public void convertDateOnly() {

        String date = "2020-02-20";
        String timezone = "America/Los_Angeles";

        ZonedDateTime zonedDateTime = ZonedDateTimeHelper.convertDateOnly(date, timezone);
        assertNotNull(zonedDateTime);
        assertEquals(2020, zonedDateTime.getYear());
        assertEquals(2, zonedDateTime.getMonthValue());
        assertEquals(20, zonedDateTime.getDayOfMonth());
        assertEquals(0, zonedDateTime.getHour());
        assertEquals(0, zonedDateTime.getMinute());
    }

    @Test
    public void getDateFromZoneDateTime() {
        String date = "2020-02-20";
        String timezone = "America/Los_Angeles";

        ZonedDateTime zonedDateTime = ZonedDateTimeHelper.convertDateOnly(date, timezone);
        String resultDate = ZonedDateTimeHelper.getDateFromZoneDateTime(zonedDateTime);

        assertEquals("2020-02-20", resultDate);
    }
}
