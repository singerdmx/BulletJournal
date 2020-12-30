package com.bulletjournal.notifications.informed;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.notifications.Event;

public class RevokeSharableEvent extends Informed {

    private final ContentType contentType;

    public RevokeSharableEvent(Event event, String originator, ContentType contentType) {
        super(event, originator);
        this.contentType = contentType;
    }

    @Override
    public ContentType getContentType() {
        return this.contentType;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## stopped sharing " + contentType.name() +
                " ##" + event.getContentName() + "## with you";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
