package com.bulletjournal.controller.models;


import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class EmailContentByUsernamesParams {

    @NotBlank
    private Long contentParentId;

    @NotNull
    private List<@NotBlank String> usernames;

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
}
