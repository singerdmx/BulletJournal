package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentAction;

import java.sql.Timestamp;

public class Auditable {
    private Long projectId;
    // projectItem may be deleted already
    private Long projectItemId;
    private String activity;
    private String originator;
    private ContentAction action;
    private Timestamp activityTime;

    public Auditable(Long projectId, String activity, String originator, Long projectItemId, Timestamp activityTime,
                     ContentAction action) {
        this.projectId = projectId;
        this.activity = activity;
        this.originator = originator;
        this.projectItemId = projectItemId;
        this.activityTime = activityTime;
        this.action = action;
    }

    public Long getProjectItemId() {
        return projectItemId;
    }

    public void setProjectItemId(Long projectItemId) {
        this.projectItemId = projectItemId;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getOriginator() {
        return originator;
    }

    public void setOriginator(String originator) {
        this.originator = originator;
    }

    public com.bulletjournal.repository.models.Auditable toRepositoryAuditable() {
        return new com.bulletjournal.repository.models.Auditable(this.projectId, this.activity, this.originator,
                this.activityTime, this.action, this.projectItemId);
    }

    public ContentAction getAction() {
        return action;
    }

    public void setAction(ContentAction action) {
        this.action = action;
    }

    public Timestamp getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(Timestamp activityTime) {
        this.activityTime = activityTime;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
