package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class AddPayerTransactionEvent extends Informed {

    public AddPayerTransactionEvent(Event event, String originator) {
        super(event, originator);
    }

    public AddPayerTransactionEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TRANSACTION;
    }

    @Override
    protected String getEventTitle(Event event) {
        return this.getOriginator() + " is added to Transaction " + event.getContentName();
    }
}
