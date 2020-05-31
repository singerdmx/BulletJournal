package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemoveProjectEvent extends Informed {

    public RemoveProjectEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemoveProjectEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.PROJECT;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## removed BuJo ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
