package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.Content;

import java.util.List;

public class ExportProjectItemParams {

    private List<Content> contents;

    private boolean isMobile;

    public ExportProjectItemParams() {
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }

    public boolean isMobile() {
        return isMobile;
    }

    public void setMobile(boolean mobile) {
        isMobile = mobile;
    }
}
