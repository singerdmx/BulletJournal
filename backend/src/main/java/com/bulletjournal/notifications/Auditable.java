package com.bulletjournal.notifications;

import java.sql.Timestamp;

import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Project;

public class Auditable {
    private Long pojectId;
    // projectItem may be deleted already
    private Long projectItemId;
    private String activity;
    private String originator;
    private ContentAction action;
    private Timestamp activityTime;

    public Auditable(Long pojectId, String activity, String originator, Long projectItemId, Timestamp activityTime,
            ContentAction action) {
        this.pojectId = pojectId;
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

    public com.bulletjournal.repository.models.Auditable toRepositoryAuditable(Project project) {
        return new com.bulletjournal.repository.models.Auditable(project, this.activity, this.originator,
                this.activityTime, this.action);
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

    public Long getPojectId() {
        return pojectId;
    }

    public void setPojectId(Long pojectId) {
        this.pojectId = pojectId;
    }
}
