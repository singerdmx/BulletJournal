package com.bulletjournal.notifications.informed;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.notifications.Event;

import java.util.List;

public class CreateProjectEvent extends Informed {

    public CreateProjectEvent(Event event, String originator) {
        super(event, originator);
    }

    public CreateProjectEvent(List<Event> event, String originator) {
        super(event, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.PROJECT;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## created BuJo ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(ContentType.PROJECT, contentId);
    }
}
