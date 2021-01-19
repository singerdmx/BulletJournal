package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;

public class EmailContentByGroupParams {

    @NotBlank
    private Long contentParentId;

    @NotBlank
    private String htmlContent;

    @NotBlank
    private String groupName;

    public EmailContentByGroupParams(@NotBlank Long contentParentId, @NotBlank String htmlContent,
                                     @NotBlank String groupName) {
        this.contentParentId = contentParentId;
        this.htmlContent = htmlContent;
        this.groupName = groupName;
    }

    public Long getContentParentId() {
        return contentParentId;
    }

    public void setContentParentId(Long contentParentId) {
        this.contentParentId = contentParentId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getHtmlContent() { return htmlContent; }

    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
}
