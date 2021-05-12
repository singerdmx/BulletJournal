package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentAction;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import static com.bulletjournal.notifications.ProjectItemAuditable.CONTENT_PROPERTY;
import static com.bulletjournal.notifications.ProjectItemAuditable.PROJECT_ITEM_PROPERTY;

public class ProjectItemActivity {
  private User originator;
  private String activity;
  private Long activityTime;
  private ContentAction action;
  private JsonObject beforeActivity;
  private JsonObject afterActivity;

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

  public JsonObject getBeforeActivity() {
    return beforeActivity;
  }

  public void setBeforeActivity(JsonObject beforeActivity) {
    this.beforeActivity = beforeActivity;
  }

  public JsonObject getAfterActivity() {
    return afterActivity;
  }

  public void setAfterActivity(JsonObject afterActivity) {
    this.afterActivity = afterActivity;
  }

  /**
   * deserialize project item activity history
   *
   * @param activityHist activity history string
   * @return activity history as Json Object
   */
  private JsonObject deserializeActivityHist(String activityHist) {
    if (activityHist == null) return null;

    JsonObject object = JsonParser.parseString(activityHist).getAsJsonObject();
    if (object.has(PROJECT_ITEM_PROPERTY)) {
      object.add(
          PROJECT_ITEM_PROPERTY,
          JsonParser.parseString(object.get(PROJECT_ITEM_PROPERTY).getAsString()).getAsJsonObject());
    }
    if (object.has(CONTENT_PROPERTY)) {
      object.add(
          CONTENT_PROPERTY,
          JsonParser.parseString(object.get(CONTENT_PROPERTY).getAsString()).getAsJsonObject());
    }
    return object;
  }
}
