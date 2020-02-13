package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.google.common.collect.ImmutableList;

import java.util.List;

public class JoinGroupEvent extends Informed implements Actionable {

    public JoinGroupEvent(Event event, String originator) {
        super(event, originator);
    }

    public JoinGroupEvent(List<Event> events, String originator) {
        super(events, originator);
    }

    @Override
    public List<Action> getActions() {
        return ImmutableList.of(Action.ACCEPT, Action.DECLINE);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }

    @Override
    protected String getEventTitle(Event event) {
        return this.getOriginator() + " invited you to join Group " + event.getContentName();
    }

}
