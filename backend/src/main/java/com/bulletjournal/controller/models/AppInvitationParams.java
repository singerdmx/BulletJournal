package com.bulletjournal.controller.models;

import java.util.List;
import javax.validation.constraints.NotNull;

public class AppInvitationParams {

  @NotNull
  private List<String> emails;

  public AppInvitationParams() {
  }

  public AppInvitationParams(List<String> emails) {
    this.emails = emails;
  }

  public List<String> getEmails() {
    return emails;
  }

  public void setEmails(List<String> emails) {
    this.emails = emails;
  }
}
