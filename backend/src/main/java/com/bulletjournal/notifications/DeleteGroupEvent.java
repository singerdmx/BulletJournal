package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Notification;

import java.util.List;
import java.util.stream.Collectors;

public class DeleteGroupEvent extends Informed {

    public static String TYPE = "DeleteGroup";

    public DeleteGroupEvent(List<Event> events, String originator) {
        super(events, originator);
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
                        "Group " + event.getContentName() + " is deleted",
                        null,
                        event.getTargetUser()))
                .collect(Collectors.toList());
    }
}
