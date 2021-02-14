package com.bulletjournal.notifications.informed;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.notifications.Event;

import java.util.List;

public class DisableGroupShareEvent extends Informed {

    public DisableGroupShareEvent(Event event, String originator) {
        super(event, originator);
    }

    public DisableGroupShareEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## has disabled link to join Group ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(ContentType.GROUP, contentId);
    }
}
