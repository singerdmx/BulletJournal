package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.google.common.collect.ImmutableList;

import java.util.List;

public class JoinGroupEvent extends Informed {

    public JoinGroupEvent(Event event, String originator) {
        super(event, originator);
    }

    public JoinGroupEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## invited you to join Group ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(ContentType.GROUP, contentId);
    }

    @Override
    public List<Action> getEventActions(Event event) {
        return ImmutableList.of(Action.ACCEPT, Action.DECLINE);
    }
}
