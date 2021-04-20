package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentAction;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "note_auditables")
public class NoteAuditable extends ProjectItemAuditModel {
  @Id
  @GeneratedValue(generator = "note_auditables_generator", strategy = GenerationType.SEQUENCE)
  @SequenceGenerator(
      name = "note_auditables_generator",
      sequenceName = "note_auditables_sequence",
      initialValue = 100)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "note_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Note note;

  public NoteAuditable(
      Note note,
      String activity,
      String originator,
      Timestamp activityTime,
      ContentAction action,
      String beforeActivity,
      String afterActivity) {
    this.note = note;
    this.activity = activity;
    this.originator = originator;
    this.activityTime = activityTime;
    this.action = action;
    this.beforeActivity = beforeActivity;
    this.afterActivity = afterActivity;
  }

  public Note getNote() {
    return note;
  }

  public void setNote(Note note) {
    this.note = note;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
}
