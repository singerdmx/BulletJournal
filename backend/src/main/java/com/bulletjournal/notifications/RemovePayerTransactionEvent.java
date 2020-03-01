package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemovePayerTransactionEvent extends Informed {

    public RemovePayerTransactionEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemovePayerTransactionEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TRANSACTION;
    }

    @Override
    protected String getEventTitle(Event event) {
        return this.getOriginator() + " is removed from Transaction " + event.getContentName();
    }
}
