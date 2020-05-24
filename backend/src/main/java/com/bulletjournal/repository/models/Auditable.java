package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.controller.models.Activity;
import com.bulletjournal.controller.models.User;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

@Entity
@Table(name = "auditables")
public class Auditable extends AuditModel {
    @Id
    @GeneratedValue(generator = "auditable_generator")
    @SequenceGenerator(name = "auditable_generator", sequenceName = "auditable_sequence", initialValue = 200)
    private Long id;

    @Column(name = "action", nullable = false, updatable = false)
    private ContentAction action;

    @Column(name = "project_item_id")
    private Long projectItemId;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "activity", nullable = false, updatable = false)
    private String activity;

    @Column(name = "activity_time", nullable = false, updatable = false)
    private Timestamp activityTime;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String originator;

    public Auditable() {
    }

    public Auditable(Long projectId, String activity, String originator, Timestamp activityTime, ContentAction action,
                     Long projectItemId) {
        this.projectId = projectId;
        this.activity = activity;
        this.originator = originator;
        this.activityTime = activityTime;
        this.action = action;
        this.projectItemId = projectItemId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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

    public Long getProjectItemId() {
        return projectItemId;
    }

    public void setProjectItemId(Long projectItemId) {
        this.projectItemId = projectItemId;
    }

    public Activity toActivity() {
        Activity activity = new Activity();
        activity.setAction(this.getAction());
        activity.setActivity(this.activity);
        activity.setActivityTime(this.activityTime.getTime());
        activity.setOriginator(new User(this.originator));
        activity.setLink(ContentAction.getContentLink(this.getAction(),
                this.projectItemId != null ? this.projectItemId : this.projectId));
        return activity;
    }
}
