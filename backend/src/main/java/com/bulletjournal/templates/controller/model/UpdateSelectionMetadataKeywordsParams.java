package com.bulletjournal.templates.controller.model;

public class UpdateSelectionMetadataKeywordsParams {
    private Long selectionId;

    public UpdateSelectionMetadataKeywordsParams() {
    }

    public UpdateSelectionMetadataKeywordsParams(Long selectionId) {
        this.selectionId = selectionId;
    }

    public Long getSelectionId() {
        return selectionId;
    }

    public void setSelectionId(Long selectionId) {
        this.selectionId = selectionId;
    }
}
