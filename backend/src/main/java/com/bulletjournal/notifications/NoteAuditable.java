package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.repository.models.Note;

import java.sql.Timestamp;

public class NoteAuditable extends ProjectItemAuditableModel {
  private Note note;

  public NoteAuditable(
      Note note,
      String beforeActivity,
      String afterActivity,
      String activity,
      String originator,
      ContentAction action,
      Timestamp activityTime) {
    this.note = note;
    this.beforeActivity = beforeActivity;
    this.afterActivity = afterActivity;
    this.activity = activity;
    this.originator = originator;
    this.action = action;
    this.activityTime = activityTime;
  }

  public com.bulletjournal.repository.models.NoteAuditable toRepositoryAuditable() {
    return new com.bulletjournal.repository.models.NoteAuditable(
        this.note,
        this.activity,
        this.originator,
        this.activityTime,
        this.action,
        this.beforeActivity,
        this.afterActivity);
  }

  public Note getNote() {
    return note;
  }

  public void setNote(Note note) {
    this.note = note;
  }
}
