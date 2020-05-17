package com.bulletjournal.controller.models;

import java.sql.Timestamp;

import com.bulletjournal.contents.ContentAction;

public class Activity {

    private User originator;
    private String activity;
    private Timestamp activityTime;
    private ContentAction action;

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

    public Timestamp getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(Timestamp activityTime) {
        this.activityTime = activityTime;
    }

    public ContentAction getAction() {
        return action;
    }

    public void setAction(ContentAction action) {
        this.action = action;
    }

}
