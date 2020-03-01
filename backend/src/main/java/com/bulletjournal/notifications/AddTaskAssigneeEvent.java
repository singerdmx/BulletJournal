package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class AddTaskAssigneeEvent extends Informed {

    public AddTaskAssigneeEvent(Event event, String originator) {
        super(event, originator);
    }

    public AddTaskAssigneeEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    @Override
    protected String getEventTitle(Event event) {
        return this.getOriginator() + " is added to Task " + event.getContentName();
    }
}
