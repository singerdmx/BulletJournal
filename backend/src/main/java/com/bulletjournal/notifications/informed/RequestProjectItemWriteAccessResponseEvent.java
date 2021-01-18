package com.bulletjournal.notifications.informed;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.notifications.Action;
import com.bulletjournal.notifications.Event;

public class RequestProjectItemWriteAccessResponseEvent extends Informed {

    private final Action action;
    private final ContentType contentType;
    private final String link;

    public RequestProjectItemWriteAccessResponseEvent(Event event, String originator,
                                                      Action action, ContentType contentType, String link) {
        super(event, originator);
        this.action = action;
        this.contentType = contentType;
        this.link = link;
    }

    @Override
    public ContentType getContentType() {
        return this.contentType;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## " + this.action.getPastTenseDescription()
                + " your request for write access to " + contentType.name() + " ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return this.link;
    }

}
