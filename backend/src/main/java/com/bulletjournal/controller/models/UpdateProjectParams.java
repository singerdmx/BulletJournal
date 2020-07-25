package com.bulletjournal.controller.models;

import org.apache.commons.lang3.StringUtils;

public class UpdateProjectParams {

    private String name;

    private Long groupId;

    private String description;

    public UpdateProjectParams() {
    }

    public UpdateProjectParams(String name, Long groupId, String description) {
        this.name = name;
        this.groupId = groupId;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasName() {
        return StringUtils.isNotBlank(this.name);
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean hasDescription() {
        return this.description != null;
    }
}
