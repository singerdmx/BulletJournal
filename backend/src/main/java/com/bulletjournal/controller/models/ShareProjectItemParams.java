package com.bulletjournal.controller.models;

public class ShareProjectItemParams {

    private Long targetGroup;

    private String targetUser;

    private boolean readOnly;

    private boolean generateLink;

    public ShareProjectItemParams() {
    }

    public ShareProjectItemParams(String targetUser, boolean readOnly) {
        this.targetUser = targetUser;
        this.readOnly = readOnly;
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

    public boolean isGenerateLink() {
        return generateLink;
    }

    public void setGenerateLink(boolean generateLink) {
        this.generateLink = generateLink;
    }

    public boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(boolean readOnly) {
        this.readOnly = readOnly;
    }
}
