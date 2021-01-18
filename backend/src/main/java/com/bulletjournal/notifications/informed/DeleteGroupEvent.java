package com.bulletjournal.notifications.informed;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.notifications.Event;

import java.util.List;

public class DeleteGroupEvent extends Informed {

    public DeleteGroupEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "Group ##" + event.getContentName() + "## is deleted";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
