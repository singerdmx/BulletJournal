package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

public class EmailContentByGroupParams {

    @NotBlank
    private Long contentParentId;

    @NotBlank
    private String groupName;

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
}
