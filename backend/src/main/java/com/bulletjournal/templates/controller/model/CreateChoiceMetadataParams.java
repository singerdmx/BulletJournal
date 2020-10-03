package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateChoiceMetadataParams {
    @NotNull
    private String keyword;
    @NotNull
    private Long choiceId;

    public CreateChoiceMetadataParams() {
    }

    public CreateChoiceMetadataParams(@NotNull String keyword, @NotNull Long choiceId) {
        this.keyword = keyword;
        this.choiceId = choiceId;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Long getChoiceId() {
        return choiceId;
    }

    public void setChoiceId(Long choiceId) {
        this.choiceId = choiceId;
    }
}
