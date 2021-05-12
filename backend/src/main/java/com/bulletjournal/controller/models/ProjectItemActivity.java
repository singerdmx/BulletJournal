package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentAction;
import com.google.gson.Gson;

import java.util.LinkedHashMap;

import static com.bulletjournal.notifications.ProjectItemAuditable.CONTENT_PROPERTY;
import static com.bulletjournal.notifications.ProjectItemAuditable.PROJECT_ITEM_PROPERTY;

public class ProjectItemActivity {
  private User originator;
  private String activity;
  private Long activityTime;
  private ContentAction action;
  private Object beforeActivity;
  private Object afterActivity;

  private Gson GSON = new Gson();

  public ProjectItemActivity(
      User originator,
      String activity,
      Long activityTime,
      ContentAction action,
      String beforeActivity,
      String afterActivity) {
    this.originator = originator;
    this.activity = activity;
    this.activityTime = activityTime;
    this.action = action;
    this.beforeActivity = this.deserializeActivityHist(beforeActivity);
    this.afterActivity = this.deserializeActivityHist(afterActivity);
  }

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

  public Object getBeforeActivity() {
    return beforeActivity;
  }

  public void setBeforeActivity(Object beforeActivity) {
    this.beforeActivity = beforeActivity;
  }

  public Object getAfterActivity() {
    return afterActivity;
  }

  public void setAfterActivity(Object afterActivity) {
    this.afterActivity = afterActivity;
  }

  /**
   * deserialize project item activity history
   *
   * @param activityHist activity history string
   * @return activity history as Json Object
   */
  private Object deserializeActivityHist(String activityHist) {
    if (activityHist == null) return null;

    LinkedHashMap object = GSON.fromJson(activityHist, LinkedHashMap.class);
    String o = (String) object.get(PROJECT_ITEM_PROPERTY);
    if (o != null) {
      object.put(PROJECT_ITEM_PROPERTY, GSON.fromJson(o, LinkedHashMap.class));
    }
    o = (String) object.get(CONTENT_PROPERTY);
    if (o != null) {
      object.put(CONTENT_PROPERTY, GSON.fromJson(o, LinkedHashMap.class));
    }

    return object;
  }
}
