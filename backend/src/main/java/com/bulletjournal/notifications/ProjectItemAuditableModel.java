package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentAction;

import java.sql.Timestamp;

public abstract class ProjectItemAuditableModel {
  public static final String PROJECT_NAME_PROPERTY = "projectName";
  public static final String PROJECT_ITEM_PROPERTY = "projectItem";
  public static final String PROJECT_CONTENT_PROPERTY = "projectContent";
  public static final String EMPTY_VALUE = "{}";

  protected String beforeActivity;
  protected String afterActivity;
  protected String activity;
  protected String originator;
  protected ContentAction action;
  protected Timestamp activityTime;

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
}
