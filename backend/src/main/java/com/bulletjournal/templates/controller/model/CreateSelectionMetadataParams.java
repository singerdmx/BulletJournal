package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateSelectionMetadataParams {
    @NotNull
    private String keyword;
    @NotNull
    private Long selectionId;

    private  Integer frequency;

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }

    public CreateSelectionMetadataParams() {
    }

    public CreateSelectionMetadataParams(@NotNull String keyword, @NotNull Long selectionId, Integer frequency) {
        this.keyword = keyword;
        this.selectionId = selectionId;
        this.frequency = frequency;
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
