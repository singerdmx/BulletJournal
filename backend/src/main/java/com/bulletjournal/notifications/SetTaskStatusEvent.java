package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class SetTaskStatusEvent extends Informed {

    public SetTaskStatusEvent(Event event, String originator) {
        super(event, originator);
    }

    public SetTaskStatusEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## changed Task status of ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(this.getContentType(), contentId);
    }
}
