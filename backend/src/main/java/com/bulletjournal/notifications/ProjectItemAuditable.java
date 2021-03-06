package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.repository.models.ProjectItemModel;

import java.sql.Timestamp;

public class ProjectItemAuditable {
  public static final String PROJECT_ITEM_PROPERTY = "projectItem";
  public static final String CONTENT_PROPERTY = "content";
  private String beforeActivity;
  private String afterActivity;
  private String activity;
  private String originator;
  private ContentAction action;
  private Timestamp activityTime;
  private ProjectItemModel projectItem;

  public ProjectItemAuditable(
      ProjectItemModel projectItemModel,
      String beforeActivity,
      String afterActivity,
      String activity,
      String originator,
      ContentAction action,
      Timestamp activityTime) {
    this.projectItem = projectItemModel;
    this.beforeActivity = beforeActivity;
    this.afterActivity = afterActivity;
    this.activity = activity;
    this.originator = originator;
    this.action = action;
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

  public ProjectItemModel getProjectItem() {
    return projectItem;
  }

  public void setProjectItem(ProjectItemModel projectItem) {
    this.projectItem = projectItem;
  }

  public com.bulletjournal.repository.models.NoteAuditable toRepositoryNoteAuditable() {
    return new com.bulletjournal.repository.models.NoteAuditable(
        (com.bulletjournal.repository.models.Note) this.projectItem,
        this.activity,
        this.originator,
        this.activityTime,
        this.action,
        this.beforeActivity,
        this.afterActivity);
  }

  public com.bulletjournal.repository.models.TaskAuditable toRepositoryTaskAuditable() {
    return new com.bulletjournal.repository.models.TaskAuditable(
        (com.bulletjournal.repository.models.Task) this.projectItem,
        this.activity,
        this.originator,
        this.activityTime,
        this.action,
        this.beforeActivity,
        this.afterActivity);
  }

  public com.bulletjournal.repository.models.TransactionAuditable toRepositoryTransactionAuditable() {
    return new com.bulletjournal.repository.models.TransactionAuditable(
        (com.bulletjournal.repository.models.Transaction) this.projectItem,
        this.activity,
        this.originator,
        this.activityTime,
        this.action,
        this.beforeActivity,
        this.afterActivity);
  }
}
