package com.bulletjournal.controller.models;

import java.util.List;

public class ExportProjectItemParams {

    private ExportType exportType;

    private List<Content> contents;

    public ExportProjectItemParams() {
    }

    public ExportType getExportType() {
        return exportType;
    }

    public void setExportType(ExportType exportType) {
        this.exportType = exportType;
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }
}
