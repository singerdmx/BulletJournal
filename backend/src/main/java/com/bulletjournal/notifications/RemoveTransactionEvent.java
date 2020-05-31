package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemoveTransactionEvent extends Informed {

    public RemoveTransactionEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemoveTransactionEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TRANSACTION;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## removed Transaction ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
