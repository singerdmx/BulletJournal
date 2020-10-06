package com.bulletjournal.templates.controller.model;

public class UpdateSelectionMetadataKeywordsParams {
    private Long selectionId;
    private Integer frequency;

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }

    public UpdateSelectionMetadataKeywordsParams() {
    }

    public UpdateSelectionMetadataKeywordsParams(Long selectionId, Integer frequency) {
        this.selectionId = selectionId;
        this.frequency = frequency;
    }

    public Long getSelectionId() {
        return selectionId;
    }

    public void setSelectionId(Long selectionId) {
        this.selectionId = selectionId;
    }
}
