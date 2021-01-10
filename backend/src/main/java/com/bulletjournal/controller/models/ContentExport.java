package com.bulletjournal.controller.models;

import java.util.List;

public class ContentExport {

    private String htmlContent;

    private String title;

    private List<String> receivers;

    public ContentExport() {
    }

    public ContentExport(String htmlContent, String title, List<String> receivers) {
        this.htmlContent = htmlContent;
        this.title = title;
        this.receivers = receivers;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getReceivers() {
        return receivers;
    }

    public void setReceivers(List<String> receivers) {
        this.receivers = receivers;
    }
}
