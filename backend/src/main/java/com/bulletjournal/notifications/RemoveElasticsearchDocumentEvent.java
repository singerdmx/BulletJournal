package com.bulletjournal.notifications;

import java.util.List;

public class RemoveElasticsearchDocumentEvent {
    private List<String> documentIds;

    public RemoveElasticsearchDocumentEvent(List<String> documentIds) {
        this.documentIds = documentIds;
    }


    public List<String> getDocumentIds() {
        return documentIds;
    }

    public void setDocumentIds(List<String> documentIds) {
        this.documentIds = documentIds;
    }
}
