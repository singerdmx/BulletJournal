package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class RemoveUserFromGroupEvent extends Informed {

    public RemoveUserFromGroupEvent(Event event, String originator) {
        super(event, originator);
    }

    public RemoveUserFromGroupEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## removed you from Group ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return null;
    }
}
