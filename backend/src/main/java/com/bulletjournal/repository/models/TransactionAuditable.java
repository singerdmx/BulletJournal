package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentAction;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "transaction_auditables")
public class TransactionAuditable extends ProjectItemAuditModel {

  @Id
  @GeneratedValue(
      generator = "transaction_auditables_generator",
      strategy = GenerationType.SEQUENCE)
  @SequenceGenerator(
      name = "transaction_auditables_generator",
      sequenceName = "transaction_auditables_sequence",
      initialValue = 100)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "transaction_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Transaction transaction;

  public TransactionAuditable(
      Transaction transaction,
      String activity,
      String originator,
      Timestamp activityTime,
      ContentAction action,
      String beforeActivity,
      String afterActivity) {
    this.transaction = transaction;
    this.activity = activity;
    this.originator = originator;
    this.activityTime = activityTime;
    this.action = action;
    this.beforeActivity = beforeActivity;
    this.afterActivity = afterActivity;
  }

}
