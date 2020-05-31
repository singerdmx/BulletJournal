package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class UpdateTransactionPayerEvent extends Informed {

    private final String payer;

    public UpdateTransactionPayerEvent(List<Event> events, String originator, String payer) {
        super(events, originator);
        this.payer = payer;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TRANSACTION;
    }

    @Override
    protected String getEventTitle(Event event) {
        if (payer == null) {
            return "Transaction ##" + event.getContentName() + "## payer is removed by ##" + event.getOriginatorAlias()
                    + "##";
        }
        return "Transaction ##" + event.getContentName() + "## payer is changed to ##" + this.payer + "## by ##"
                + event.getOriginatorAlias() + "##";
    }

    @Override
    public String getLink(Long contentId) {
        if (payer != null) {
            return ContentType.getContentLink(ContentType.TRANSACTION, contentId);
        }
        return null;
    }
}
