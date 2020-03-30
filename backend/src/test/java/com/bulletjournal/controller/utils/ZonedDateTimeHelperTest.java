package com.bulletjournal.controller.utils;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;

import java.time.ZoneId;
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
        String resultDate = ZonedDateTimeHelper.getDate(zonedDateTime);

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

    @Test
    public void testIntervalWithTime() {
        String date = "2020-02-20";
        String time = "11:05";
        String timezone = "America/Los_Angeles";

        ZonedDateTime zonedStartDateTime = ZonedDateTimeHelper.getStartTime(date, time, timezone);
        assertNotNull(zonedStartDateTime);
        assertEquals(2020, zonedStartDateTime.getYear());
        assertEquals(2, zonedStartDateTime.getMonthValue());
        assertEquals(20, zonedStartDateTime.getDayOfMonth());
        assertEquals(11, zonedStartDateTime.getHour());
        assertEquals(5, zonedStartDateTime.getMinute());

        ZonedDateTime zonedEndDateTime = ZonedDateTimeHelper.getEndTime(date, time, timezone);
        assertEquals(zonedStartDateTime, zonedEndDateTime);
        assertEquals(2020, zonedEndDateTime.getYear());
        assertEquals(2, zonedEndDateTime.getMonthValue());
        assertEquals(20, zonedEndDateTime.getDayOfMonth());
        assertEquals(11, zonedEndDateTime.getHour());
        assertEquals(5, zonedEndDateTime.getMinute());
    }

    @Test
    public void testIntervalWithDifferentZone() {
        String date = "2020-02-20";
        String time = "11:05";
        String timezone = "America/Los_Angeles";

        ZonedDateTime zonedStartDateTime = ZonedDateTimeHelper.getStartTime(date, time, timezone);
        assertNotNull(zonedStartDateTime);
        assertEquals(2020, zonedStartDateTime.getYear());
        assertEquals(2, zonedStartDateTime.getMonthValue());
        assertEquals(20, zonedStartDateTime.getDayOfMonth());
        assertEquals(11, zonedStartDateTime.getHour());
        assertEquals(5, zonedStartDateTime.getMinute());

        ZoneId chinaZoneID = ZoneId.of("Asia/Shanghai");
        ZonedDateTime zonedStartDateTimeInChina = zonedStartDateTime.withZoneSameInstant(chinaZoneID);
        assertNotNull(zonedStartDateTime);
        assertEquals(2020, zonedStartDateTimeInChina.getYear());
        assertEquals(2, zonedStartDateTimeInChina.getMonthValue());
        assertEquals(21, zonedStartDateTimeInChina.getDayOfMonth());
        assertEquals(3, zonedStartDateTimeInChina.getHour());
        assertEquals(5, zonedStartDateTimeInChina.getMinute());
    }

    @Test
    public void testIntervalWithoutTime() {
        String date = "2020-02-20";
        String timezone = "America/Los_Angeles";

        ZonedDateTime zonedStartDateTime = ZonedDateTimeHelper.getStartTime(date, null, timezone);
        assertNotNull(zonedStartDateTime);
        assertEquals(2020, zonedStartDateTime.getYear());
        assertEquals(2, zonedStartDateTime.getMonthValue());
        assertEquals(20, zonedStartDateTime.getDayOfMonth());
        assertEquals(0, zonedStartDateTime.getHour());
        assertEquals(0, zonedStartDateTime.getMinute());

        ZonedDateTime zonedEndDateTime = ZonedDateTimeHelper.getEndTime(date, null, timezone);
        assertNotEquals(zonedStartDateTime, zonedEndDateTime);
        assertEquals(2020, zonedEndDateTime.getYear());
        assertEquals(2, zonedEndDateTime.getMonthValue());
        assertEquals(20, zonedEndDateTime.getDayOfMonth());
        assertEquals(23, zonedEndDateTime.getHour());
        assertEquals(59, zonedEndDateTime.getMinute());
    }
}
