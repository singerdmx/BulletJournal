package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemoveTaskAssigneeEvent extends Informed {

    public RemoveTaskAssigneeEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemoveTaskAssigneeEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    @Override
    protected String getEventTitle(Event event) {
        return this.getOriginator() + " is removed from Task " + event.getContentName();
    }
}
