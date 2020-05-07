package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemoveFromProjectEvent extends Informed {

    public RemoveFromProjectEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemoveFromProjectEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.PROJECT;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "You've been removed from BuJo ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
