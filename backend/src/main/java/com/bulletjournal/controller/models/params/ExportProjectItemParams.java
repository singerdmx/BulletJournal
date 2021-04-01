package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.Content;

import java.util.List;

public class ExportProjectItemParams {

    private List<Content> contents;

    public ExportProjectItemParams() {
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }
}
