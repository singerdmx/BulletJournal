package com.bulletjournal.controller.models;

public class RevokeProjectItemSharableParams {

    private String user;

    private String link;

    public RevokeProjectItemSharableParams() {
    }

    public RevokeProjectItemSharableParams(String user, String link) {
        this.user = user;
        this.link = link;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public boolean hasUser() {
        return this.user != null;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public boolean hasLink() {
        return this.link != null;
    }
}
