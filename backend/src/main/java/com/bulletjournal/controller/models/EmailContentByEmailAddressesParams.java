package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

public class EmailContentByEmailAddressesParams {

    @NotBlank
    private Long contentParentId;

    @NotBlank
    private String htmlContent;

    @NotNull
    private List<@NotBlank String> emailAddresses;

    public EmailContentByEmailAddressesParams(@NotBlank Long contentParentId, @NotBlank String htmlContent,
                                              @NotNull List<@NotBlank String> emailAddresses) {
        this.contentParentId = contentParentId;
        this.htmlContent = htmlContent;
        this.emailAddresses = emailAddresses;
    }

    public Long getContentParentId() {
        return contentParentId;
    }

    public void setContentParentId(Long contentParentId) {
        this.contentParentId = contentParentId;
    }

    public List<String> getEmailAddresses() {
        return emailAddresses;
    }

    public void setEmailAddresses(List<String> emailAddresses) {
        this.emailAddresses = emailAddresses;
    }

    public String getHtmlContent() { return htmlContent; }

    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
}
