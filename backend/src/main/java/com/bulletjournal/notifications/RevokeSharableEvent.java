package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

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
