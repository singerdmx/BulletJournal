package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class RemoveUserCategoryParams {
  @NotNull
  private Long categoryId;

  @NotBlank
  private Long selectionId;

  public RemoveUserCategoryParams() {
  }

  public RemoveUserCategoryParams(Long categoryId, Long selectionId) {
    this.categoryId = categoryId;
    this.selectionId = selectionId;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public Long getSelectionId() {
    return selectionId;
  }

  public void setSelectionId(Long selectionId) {
    this.selectionId = selectionId;
  }
}
