package com.bulletjournal.controller.models.params;

import java.util.List;

public class ExportProjectItemAsEmailParams extends ExportProjectItemParams {

  private Long targetGroup;

  private String targetUser;

  private List<String> emails;

  public ExportProjectItemAsEmailParams() {
  }

  public ExportProjectItemAsEmailParams(String targetUser) {
    this.targetUser = targetUser;
  }

  public Long getTargetGroup() {
    return targetGroup;
  }

  public void setTargetGroup(Long targetGroup) {
    this.targetGroup = targetGroup;
  }

  public String getTargetUser() {
    return targetUser;
  }

  public void setTargetUser(String targetUser) {
    this.targetUser = targetUser;
  }

  public List<String> getEmails() {
    return emails;
  }

  public void setEmails(List<String> emails) {
    this.emails = emails;
  }
}
