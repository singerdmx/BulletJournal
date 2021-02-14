package com.bulletjournal.notifications.informed;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.notifications.Event;

import java.util.List;

public class ShareGroupEvent extends Informed {

    public ShareGroupEvent(Event event, String originator) {
        super(event, originator);
    }

    public ShareGroupEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## has enabled link to join Group ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(ContentType.GROUP, contentId);
    }
}
