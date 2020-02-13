package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Notification;
import com.google.common.collect.ImmutableList;

import java.util.List;
import java.util.stream.Collectors;

public class JoinGroupEvent extends Informed implements Actionable {

    public static String TYPE = "JoinGroup";

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
    public String getEventType() {
        return TYPE;
    }

    @Override
    public List<Notification> toNotifications() {
        return this.getEvents().stream()
                .map(event -> new Notification(
                        this.getOriginator(),
                        this.getOriginator() + " invited you to join Group " + event.getContentName(),
                        null,
                        event.getTargetUser()))
                .collect(Collectors.toList());
    }

}
