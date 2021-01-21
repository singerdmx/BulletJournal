package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.Content;

import java.util.List;

public class ExportProjectItemAsEmailParams {

  private Long targetGroup;

  private String targetUser;

  private List<String> emails;

  private List<Content> contents;

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

  public List<Content> getContents() {
    return contents;
  }

  public void setContents(List<Content> contents) {
    this.contents = contents;
  }

  public String generateExportHtml() {
    StringBuilder result = new StringBuilder();
    for (Content content : this.contents) {
      User owner = content.getOwner();
      String username = owner.getName();
      String avatar = owner.getAvatar();
      String createAt = content.getCreatedAt().toString();
      String updateAt = content.getUpdatedAt().toString();
      String htmlText = content.getText();

      String contentInfo =
          "<div>"
              + "<div>"
              + "<div style=\"float: left\">\n"
              + "   <img src=" + avatar
              + " alt=\"owner_avatar\" style=\"border-radius: 50%;width:20px;height:20px;\">\n"
              + "</div>"
              + "<div style=\"float: left\">\n"
              + "   <span style=\"margin-left: 5px; color: #e8aed0;font-size: 17px; margin-right: 8px\">"
              + username + "</span>\n"
              + "</div>"
              + "<div style=\"float: left\">\n"
              + "   <span style=\"margin-left: 5px\"> Created at: " + createAt + "</span>\n"
              + "</div>"
              + "<div style=\"float: left\">\n"
              + "   <span style=\"margin-left: 5px\"> Updated at: " + updateAt + "</span>\n"
              + "</div>"
              + "<br><div>" + htmlText + "</div>"
              + "</div>";

      result.append(contentInfo);
    }
    return "<div>" + result.toString() + "</div>";
  }
}
