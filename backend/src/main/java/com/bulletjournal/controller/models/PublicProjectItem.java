package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;

import java.util.List;

public class PublicProjectItem {

    private List<Content> contents;

    private ContentType contentType;

    private ProjectItem projectItem;

    protected Long projectId;

    public PublicProjectItem() {
    }

    public PublicProjectItem(ContentType contentType, List<Content> contents, ProjectItem projectItem, Long projectId) {
        this.contentType = contentType;
        this.contents = contents;
        this.projectItem = projectItem;
        this.projectId = projectId;
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

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
