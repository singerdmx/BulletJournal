package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

public class InviteToJoinGroupEvent extends Informed {

    private final String invitee;

    public InviteToJoinGroupEvent(Event event, String originator, String invitee) {
        super(event, originator);
        this.invitee = invitee;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.GROUP;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## invited ##" + this.invitee +
                "## to join Group ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(ContentType.GROUP, contentId);
    }
}
