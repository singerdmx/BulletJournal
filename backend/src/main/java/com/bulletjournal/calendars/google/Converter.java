package com.bulletjournal.calendars.google;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventReminder;
import org.dmfs.rfc5545.DateTime;
import org.slf4j.MDC;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class Converter {
    private static final int DEFAULT_REMINDER_SETTING = 30;

    public static GoogleCalendarEvent toTask(Event event, String timezone) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        Task task = new Task();
        task.setOwner(username);
        task.setAssignedTo(username);
        task.setName(event.getSummary());
        task.setTimezone(timezone);

        EventDateTime startEventDateTime = event.getStart();
        EventDateTime endEventDateTime = event.getEnd();
        if (startEventDateTime != null && endEventDateTime != null) {

            long endDateTimeValue = endEventDateTime.getDateTime().getValue();
            long startDateTimeValue = startEventDateTime.getDateTime().getValue();

            setTaskRecurrence(task, timezone, event.getRecurrence(), startDateTimeValue);

            task.setDuration((int) TimeUnit.MILLISECONDS.toMinutes(endDateTimeValue - startDateTimeValue));
            DateTime endDateTime = ZonedDateTimeHelper.getDateTime(endDateTimeValue, timezone);
            task.setDueDate(ZonedDateTimeHelper.getDate(endDateTime));
            task.setDueTime(ZonedDateTimeHelper.getTime(endDateTime));

            setTaskReminder(task, timezone, event.getReminders(), startDateTimeValue);
        }

        StringBuilder text = new StringBuilder();
        if (event.getDescription() != null) {
            text.append("description:").append(event.getDescription()).append(System.lineSeparator());
        }
        if (event.getLocation() != null) {
            text.append("location:").append(event.getLocation()).append(System.lineSeparator());
        }
        List<EventAttendee> attendeeList = event.getAttendees();
        if (attendeeList != null) {
            text.append("attendees:").append(System.lineSeparator());
            for (EventAttendee attendee : attendeeList) {
                text.append("name:").append(attendee.getDisplayName()).append(" email:").append(attendee.getEmail());
                text.append(System.lineSeparator());
            }
        }

        task.setAssignedTo(username);

        Content content = new Content();
        content.setText(text.toString());
        content.setOwner(username);

        return new GoogleCalendarEvent(task, content, event.getICalUID());
    }

    private static void setTaskReminder(Task task, String timezone, Event.Reminders reminders, long startDateTimeValue) {
        ReminderSetting reminderSetting = new ReminderSetting();
        if (reminders.getUseDefault()) {
            DateTime reminderDateTime = ZonedDateTimeHelper.getDateTime(startDateTimeValue - TimeUnit.MINUTES.toMillis(DEFAULT_REMINDER_SETTING), timezone);
            reminderSetting.setDate(ZonedDateTimeHelper.getDate(reminderDateTime));
            reminderSetting.setTime(ZonedDateTimeHelper.getTime(reminderDateTime));
        } else {
            List<EventReminder> eventReminderList = reminders.getOverrides();
            int minutes = 0;
            for (EventReminder eventReminder : eventReminderList) {
                minutes = Math.max(minutes, eventReminder.getMinutes());
            }
            DateTime reminderDateTime = ZonedDateTimeHelper.getDateTime(startDateTimeValue - TimeUnit.MINUTES.toMillis(minutes), timezone);
            reminderSetting.setDate(ZonedDateTimeHelper.getDate(reminderDateTime));
            reminderSetting.setTime(ZonedDateTimeHelper.getTime(reminderDateTime));
        }
        task.setReminderSetting(reminderSetting);
    }

    /*Set recurrence of event to task, rRule complies with rfc5545
    * rRule:
    *        RRULE:FREQ=DAILY;UNTIL=20200724T065959Z
    */
    private static void setTaskRecurrence(Task task, String timezone, List<String> rRule, long startDateTimeValue) {
        if (rRule != null && !rRule.isEmpty()) {
            DateTime startDateTime = ZonedDateTimeHelper.getDateTime(startDateTimeValue, timezone);
            task.setRecurrenceRule("DTSTART:" + startDateTime.toString() + " " + rRule.get(0));
        }
    }

    public static CreateTaskParams toCreateTaskParams(GoogleCalendarEvent event) {
        return new CreateTaskParams();
    }
}
