package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentAction;

public class ProjectItemActivity {

  private User originator;
  private String activity;
  private Long activityTime;
  private ContentAction action;
  private String beforeActivity;
  private String afterActivity;

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

  public Long getActivityTime() {
    return activityTime;
  }

  public void setActivityTime(Long activityTime) {
    this.activityTime = activityTime;
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
}
