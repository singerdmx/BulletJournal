package com.bulletjournal.calendars.google;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.Task;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import jdk.internal.joptsimple.internal.Strings;
import org.slf4j.MDC;

public class Converter {

    public static GoogleCalendarEvent toTask(Event event, String timezone) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Task task = new Task();
        task.setOwner(username);
        task.setAssignedTo(username);
        task.setName(event.getSummary());
        event.getOriginalStartTime();
        if (!event.getRecurrence().isEmpty()) {
            task.setRecurrenceRule(Strings.join(event.getRecurrence(), ";"));
        }
        task.setTimezone(timezone);

        EventDateTime startDateTime = event.getStart();
        if (startDateTime != null) {
            EventDateTime endDateTime = event.getEnd();
//            task.setDueDate();
//            task.setDueTime();
//            task.setDuration();
        }

        event.getReminders();
        new ReminderSetting();

        StringBuilder text = new StringBuilder();
        text.append(event.getDescription()).append(System.lineSeparator());
        event.getAttendees();
        event.getLocation();

        Content content = new Content();
        content.setText(text.toString());
        content.setOwner(username);
        GoogleCalendarEvent googleCalendarEvent = new GoogleCalendarEvent(
                task, content, event.getICalUID());
        return googleCalendarEvent;
    }

    public static CreateTaskParams toCreateTaskParams(GoogleCalendarEvent event) {
        return new CreateTaskParams();
    }
}
