package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class UpdateTaskAssigneeEvent extends Informed {

    private final String assignedTo;

    public UpdateTaskAssigneeEvent(List<Event> events, String originator, String assignedTo) {
        super(events, originator);
        this.assignedTo = assignedTo;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    @Override
    protected String getEventTitle(Event event) {
        if (assignedTo == null) {
            return "Task " + event.getContentName() + " is unassigned by " + this.getOriginator();
        }
        return "Task " + event.getContentName() + " is assigned to " + this.assignedTo + " by " + this.getOriginator();
    }
}
