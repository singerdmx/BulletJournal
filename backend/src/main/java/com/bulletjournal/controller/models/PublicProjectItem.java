package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class PublicProjectItem extends ProjectItem {

    private List<Content> contents;

    private ContentType contentType;

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }

    @Override
    public ContentType getContentType() {
        return this.contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }
}
