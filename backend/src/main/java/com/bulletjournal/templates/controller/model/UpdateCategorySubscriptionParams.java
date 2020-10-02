package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotBlank;

public class UpdateCategorySubscriptionParams {
  @NotBlank
  private Long selectionId;

  @NotBlank
  private Long projectId;

  public UpdateCategorySubscriptionParams() {
  }

  public UpdateCategorySubscriptionParams(@NotBlank Long selectionId, @NotBlank Long projectId) {
    this.selectionId = selectionId;
    this.projectId = projectId;
  }

  public Long getSelectionId() {
    return selectionId;
  }

  public void setSelectionId(Long selectionId) {
    this.selectionId = selectionId;
  }

  public Long getProjectId() {
    return projectId;
  }

  public void setProjectId(Long projectId) {
    this.projectId = projectId;
  }
}
