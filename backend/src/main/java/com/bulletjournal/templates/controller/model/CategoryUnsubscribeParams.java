package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotBlank;

public class CategoryUnsubscribeParams {
  @NotBlank
  private Long selectionId;

  public CategoryUnsubscribeParams() {
  }

  public CategoryUnsubscribeParams(Long selectionId) {
    this.selectionId = selectionId;
  }

  public Long getSelectionId() {
    return selectionId;
  }

  public void setSelectionId(Long selectionId) {
    this.selectionId = selectionId;
  }
}
