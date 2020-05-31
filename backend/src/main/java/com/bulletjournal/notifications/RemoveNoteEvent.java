package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemoveNoteEvent extends Informed {

    public RemoveNoteEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemoveNoteEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.NOTE;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## removed Note ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
