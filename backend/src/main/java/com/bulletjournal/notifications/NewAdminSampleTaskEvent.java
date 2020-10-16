package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class NewAdminSampleTaskEvent extends Informed {

    public NewAdminSampleTaskEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.SAMPLE_TASK;
    }

    @Override
    protected String getEventTitle(Event event) {
        return event.getContentName();
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(ContentType.SAMPLE_TASK, contentId);
    }
}
