package com.bulletjournal.controller.models;

public class UpdateProjectParams {

    private String name;

    private Long groupId;

    public UpdateProjectParams() {
    }

    public UpdateProjectParams(String name, Long groupId) {
        this.name = name;
        this.groupId = groupId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasName() {
        return this.name != null;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public boolean hasGroupId() {
        return this.groupId != null;
    }
}
