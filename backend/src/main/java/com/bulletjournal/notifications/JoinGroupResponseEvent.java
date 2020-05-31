package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class JoinGroupResponseEvent extends Informed {

    private final Action action;

    public JoinGroupResponseEvent(Event event, String originator, Action action) {
        super(event, originator);
        this.action = action;
    }

    public JoinGroupResponseEvent(List<Event> events, String originator, Action action) {
        super(events, originator);
        this.action = action;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }


    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## " + this.action.getPastTenseDescription()
                + " your invitation to join Group ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(ContentType.GROUP, contentId);
    }
}
