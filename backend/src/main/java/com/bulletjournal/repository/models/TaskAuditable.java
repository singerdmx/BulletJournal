package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentAction;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "task_auditables")
public class TaskAuditable extends ProjectItemAuditModel {

  @Id
  @GeneratedValue(generator = "task_auditables_generator", strategy = GenerationType.SEQUENCE)
  @SequenceGenerator(
      name = "task_auditables_generator",
      sequenceName = "task_auditables_sequence",
      initialValue = 100)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "task_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Task task;

  public TaskAuditable(
      Task task,
      String activity,
      String originator,
      Timestamp activityTime,
      ContentAction action,
      String beforeActivity,
      String afterActivity) {
    this.task = task;
    this.activity = activity;
    this.originator = originator;
    this.activityTime = activityTime;
    this.action = action;
    this.beforeActivity = beforeActivity;
    this.afterActivity = afterActivity;
  }

  public Task getTask() {
    return task;
  }

  public void setTask(Task task) {
    this.task = task;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
}
