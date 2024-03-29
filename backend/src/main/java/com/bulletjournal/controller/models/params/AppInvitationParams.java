package com.bulletjournal.controller.models.params;

import javax.validation.constraints.NotNull;
import java.util.List;

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
