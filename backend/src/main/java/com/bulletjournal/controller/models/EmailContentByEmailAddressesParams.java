package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

public class EmailContentByEmailAddressesParams {
    @NotBlank
    private Long contentParentId;

    @NotNull
    private List<@NotBlank String> emailAddresses;

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
}
