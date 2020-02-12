package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Notification {

    @NotBlank
    private String content;

    @NotNull
    private Long timestamp;

    @NotBlank
    private String targetUser;

    public Notification() {
    }

    public Notification(@NotBlank String content, @NotNull Long timestamp, @NotBlank String targetUser) {
        this.content = content;
        this.timestamp = timestamp;
        this.targetUser = targetUser;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(String targetUser) {
        this.targetUser = targetUser;
    }
}
