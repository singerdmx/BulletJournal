package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class SetLabelEvent extends Informed {

    private final String contentType;

    public SetLabelEvent(List<Event> event, String originator, String contentType) {
        super(event, originator);
        this.contentType = contentType;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.LABEL;
    }

    @Override
    protected String getEventTitle(Event event) {
        return this.getOriginator() + " updated labels for " + contentType + " " + event.getContentName();
    }
}
