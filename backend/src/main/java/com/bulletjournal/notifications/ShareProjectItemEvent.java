package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class ShareProjectItemEvent extends Informed {

    private final ContentType contentType;

    public ShareProjectItemEvent(List<Event> events, String originator, ContentType contentType) {
        super(events, originator);
        this.contentType = contentType;
    }

    @Override
    public ContentType getContentType() {
        return this.contentType;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## shared " + contentType.name() +
                " ##" + event.getContentName() + "## with you";
    }

    @Override
    public String getLink(Long contentId) {
        return String.format("/sharedItems/" + this.contentType.name() + "%d", contentId);
    }
}
