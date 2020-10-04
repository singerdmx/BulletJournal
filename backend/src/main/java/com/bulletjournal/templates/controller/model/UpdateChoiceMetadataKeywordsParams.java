package com.bulletjournal.templates.controller.model;

public class UpdateChoiceMetadataKeywordsParams {
    private Long choiceId;

    public UpdateChoiceMetadataKeywordsParams() {
    }

    public UpdateChoiceMetadataKeywordsParams(Long choiceId) {
        this.choiceId = choiceId;
    }

    public Long getChoiceId() {
        return choiceId;
    }

    public void setChoiceId(Long choiceId) {
        this.choiceId = choiceId;
    }
}
