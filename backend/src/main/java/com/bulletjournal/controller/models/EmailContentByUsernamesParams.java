package com.bulletjournal.controller.models;


import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class EmailContentByUsernamesParams {

    @NotBlank
    private Long contentParentId;

    @NotBlank
    private String htmlContent;

    @NotNull
    private List<@NotBlank String> usernames;

    public EmailContentByUsernamesParams(@NotBlank Long contentParentId, @NotBlank String htmlContent,
                                         @NotNull List<@NotBlank String> usernames) {
        this.contentParentId = contentParentId;
        this.htmlContent = htmlContent;
        this.usernames = usernames;
    }

    public Long getContentParentId() {
        return contentParentId;
    }

    public void setContentParentId(Long contentParentId) {
        this.contentParentId = contentParentId;
    }

    public List<String> getUsernames() {
        return usernames;
    }

    public void setUsernames(List<String> usernames) {
        this.usernames = usernames;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }
}
