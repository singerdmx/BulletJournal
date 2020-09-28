package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class RemoveUserCategoryParams {
  @NotNull private Long categoryId;

  @NotBlank
  @Size(min = 1, max = 100)
  private String username;

  @NotBlank
  String metadataKeyword;

  public RemoveUserCategoryParams() {}

  public RemoveUserCategoryParams(Long categoryId, String username, String metadataKeyword) {
    this.categoryId = categoryId;
    this.username = username;
    this.metadataKeyword = metadataKeyword;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public String getMetadataKeyword() {
    return metadataKeyword;
  }

  public void setMetadataKeyword(String metadataKeyword) {
    this.metadataKeyword = metadataKeyword;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }
}
