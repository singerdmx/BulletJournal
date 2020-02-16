package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class RemoveUserGroupParams {
    @NotNull
    private Long groupId;
    @NotBlank
    @Size(min = 1, max = 100)
    private String username;

    public RemoveUserGroupParams() {
    }

    public RemoveUserGroupParams(Long groupId, String username) {
        this.groupId = groupId;
        this.username = username;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
