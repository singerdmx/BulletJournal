package com.bulletjournal.controller.models;

public class AddUserGroupParams {
    private Long groupId;
    private String username;

    public AddUserGroupParams() {
    }

    public AddUserGroupParams(Long groupId, String username) {
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
