package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

@MappedSuperclass
public abstract class ProjectItemAuditModel extends AuditModel {
  @Column(name = "action", nullable = false, updatable = false)
  protected ContentAction action;

  @Column(name = "activity", nullable = false, updatable = false)
  @Size(max = 512)
  protected String activity;

  @Column(name = "activity_time", nullable = false, updatable = false)
  protected Timestamp activityTime;

  @NotBlank
  @Size(min = 2, max = 100)
  @Column(length = 100, nullable = false, updatable = false)
  protected String originator;

  @Column(name = "before_activity", columnDefinition = "TEXT")
  protected String beforeActivity;

  @Column(name = "after_activity", columnDefinition = "TEXT")
  protected String afterActivity;

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

  public String getOriginator() {
    return originator;
  }

  public void setOriginator(String originator) {
    this.originator = originator;
  }

  public String getBeforeActivity() {
    return beforeActivity;
  }

  public void setBeforeActivity(String beforeActivity) {
    this.beforeActivity = beforeActivity;
  }

  public String getAfterActivity() {
    return afterActivity;
  }

  public void setAfterActivity(String afterActivity) {
    this.afterActivity = afterActivity;
  }

  public ContentAction getAction() {
    return action;
  }

  public void setAction(ContentAction action) {
    this.action = action;
  }
}
