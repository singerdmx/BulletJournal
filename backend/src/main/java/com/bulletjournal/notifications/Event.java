package com.bulletjournal.notifications;

public class Event {

    private String targetUser;

    private Long contentId;

    private String contentName;

    private String originatorAlias;

    public Event(String targetUser, Long contentId, String contentName) {
        this.targetUser = targetUser;
        this.contentId = contentId;
        this.contentName = contentName;
    }

    public String getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(String targetUser) {
        this.targetUser = targetUser;
    }

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public String getContentName() {
        return contentName;
    }

    public void setContentName(String contentName) {
        this.contentName = contentName;
    }

    public String getOriginatorAlias() {
        return originatorAlias;
    }

    public void setOriginatorAlias(String originatorAlias) {
        this.originatorAlias = originatorAlias;
    }

    @Override
    public String toString() {
        return "Event{" +
                "targetUser='" + targetUser + '\'' +
                ", contentId=" + contentId +
                ", contentName='" + contentName + '\'' +
                '}';
    }
}
