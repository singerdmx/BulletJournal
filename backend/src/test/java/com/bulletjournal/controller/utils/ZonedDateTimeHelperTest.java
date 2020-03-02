package com.bulletjournal.controller.utils;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import java.time.ZonedDateTime;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

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

    @Test
    public void convertDateAndTime() {
        String date = "2020-02-20";
        String time = "11:05";
        String timezone = "America/Los_Angeles";

        ZonedDateTime zonedDateTime = ZonedDateTimeHelper.convertDateAndTime(date, time, timezone);
        assertNotNull(zonedDateTime);
        assertEquals(2020, zonedDateTime.getYear());
        assertEquals(2, zonedDateTime.getMonthValue());
        assertEquals(20, zonedDateTime.getDayOfMonth());
        assertEquals(11, zonedDateTime.getHour());
        assertEquals(5, zonedDateTime.getMinute());
    }

    @Test
    public void convertSingleDigitToTwoDigits() {
        assertEquals("00", ZonedDateTimeHelper.convertSingleDigitToTwoDigits(0));
        assertEquals("05", ZonedDateTimeHelper.convertSingleDigitToTwoDigits(5));
        assertEquals("15", ZonedDateTimeHelper.convertSingleDigitToTwoDigits(15));
    }
}
