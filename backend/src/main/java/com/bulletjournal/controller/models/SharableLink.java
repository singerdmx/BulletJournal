package com.bulletjournal.controller.models;

public class SharableLink {

    public Long createdAt;
    private String link;
    private Long expirationTime;

    public SharableLink() {
    }

    public SharableLink(String link, Long expirationTime, Long createdAt) {
        this.link = link;
        this.expirationTime = expirationTime;
        this.createdAt = createdAt;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Long getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Long expirationTime) {
        this.expirationTime = expirationTime;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }
}
