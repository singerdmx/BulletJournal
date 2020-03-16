package com.bulletjournal.controller.models;

public class ShareProjectItemParams {

    private Long targetGroup;

    private String targetUser;

    public ShareProjectItemParams() {
    }

    public Long getTargetGroup() {
        return targetGroup;
    }

    public void setTargetGroup(Long targetGroup) {
        this.targetGroup = targetGroup;
    }

    public String getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(String targetUser) {
        this.targetUser = targetUser;
    }
}
