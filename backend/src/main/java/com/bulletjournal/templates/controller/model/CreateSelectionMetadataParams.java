package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateSelectionMetadataParams {
    @NotNull
    private String keyword;
    @NotNull
    private Long selectionId;

    public CreateSelectionMetadataParams() {
    }

    public CreateSelectionMetadataParams(@NotNull String keyword, @NotNull Long selectionId) {
        this.keyword = keyword;
        this.selectionId = selectionId;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Long getSelectionId() {
        return selectionId;
    }

    public void setSelectionId(Long selectionId) {
        this.selectionId = selectionId;
    }
}
