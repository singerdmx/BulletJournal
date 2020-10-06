package com.bulletjournal.templates.repository.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class UserSampleTaskKey implements Serializable {
  @Column(name = "user_id")
  Long userId;

  @Column(name = "sample_task_id")
  Long sampleTaskId;

  public UserSampleTaskKey() {
  }

  public UserSampleTaskKey(Long userId, Long sampleTaskId) {
    this.userId = userId;
    this.sampleTaskId = sampleTaskId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getSampleTaskId() {
    return sampleTaskId;
  }

  public void setSampleTaskId(Long sampleTaskId) {
    this.sampleTaskId = sampleTaskId;
  }
}
