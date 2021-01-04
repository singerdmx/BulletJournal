package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class SaveCollabItemParams {
    @NotNull
    private ContentType contentType;
    @NotNull
    private Long itemId;
    @NotNull
    private Long contentId;
    @NotBlank
    private String text;
    @NotBlank
    private String uuid;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
