package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentAction;

public class Activity {

    private User originator;
    private String activity;
    private Long activityTime;
    private ContentAction action;
    private String link;

    public User getOriginator() {
        return originator;
    }

    public void setOriginator(User originator) {
        this.originator = originator;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public ContentAction getAction() {
        return action;
    }

    public void setAction(ContentAction action) {
        this.action = action;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Long getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(Long activityTime) {
        this.activityTime = activityTime;
    }

}
