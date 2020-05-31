package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

public class UpdateTaskAssigneeEvent extends Informed {

    private final String assignedTo;

    public UpdateTaskAssigneeEvent(Event event, String originator, String assignedTo) {
        super(event, originator);
        this.assignedTo = assignedTo;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    @Override
    protected String getEventTitle(Event event) {
        if (assignedTo == null) {
            return "Task ##" + event.getContentName() + "## is unassigned by ##" + event.getOriginatorAlias() + "##";
        }
        return "Task ##" + event.getContentName() + "## is assigned to ##" + this.assignedTo + "## by ##"
                + event.getOriginatorAlias() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(this.getContentType(), contentId);
    }
}
