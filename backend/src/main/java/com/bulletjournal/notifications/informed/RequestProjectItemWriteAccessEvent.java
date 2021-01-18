package com.bulletjournal.notifications.informed;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.notifications.Action;
import com.bulletjournal.notifications.Event;
import com.google.common.collect.ImmutableList;

import java.util.List;

public class RequestProjectItemWriteAccessEvent extends Informed {

    private final ContentType contentType;

    public RequestProjectItemWriteAccessEvent(Event event, String originator, ContentType contentType) {
        super(event, originator);
        this.contentType = contentType;
    }

    @Override
    public ContentType getContentType() {
        return this.contentType;
    }

    @Override
    protected String getEventTitle(Event event) {
        return "##" + event.getOriginatorAlias() + "## requested write access to " + contentType.name() +
                " ##" + event.getContentName() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        return ContentType.getContentLink(this.getContentType(), contentId);
    }

    @Override
    public List<Action> getEventActions(Event event) {
        return ImmutableList.of(Action.ACCEPT, Action.DECLINE);
    }
}
