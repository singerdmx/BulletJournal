package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class PublicProjectItem {

    private List<Content> contents;

    private ContentType contentType;

    private ProjectItem projectItem;

    public PublicProjectItem() {
    }

    public PublicProjectItem(ContentType contentType, List<Content> contents, ProjectItem projectItem) {
        this.contentType = contentType;
        this.contents = contents;
        this.projectItem = projectItem;
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }

    public ContentType getContentType() {
        return this.contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public ProjectItem getProjectItem() {
        return projectItem;
    }

    public void setProjectItem(ProjectItem projectItem) {
        this.projectItem = projectItem;
    }
}
