package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemoveTaskEvent extends Informed {

    public RemoveTaskEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemoveTaskEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## removed Task ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
