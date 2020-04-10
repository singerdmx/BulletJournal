package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class JoinProjectEvent extends Informed {

    public JoinProjectEvent(Event event, String originator) {
        super(event, originator);
    }

    public JoinProjectEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.PROJECT;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "You've been added to " + event.getContentName() + " by " + this.getOriginator();
    }

    @Override
    protected String getLink(Long contentId) {
        return String.format("/projects/%d", contentId);
    }
}
