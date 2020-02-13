package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Notification {

    @NotNull
    private Long id;

    @NotBlank
    private String title;

    private String content;

    @NotNull
    private Long timestamp;

    @NotBlank
    private String originator;

    public Notification() {
    }

    public Notification(@NotNull Long id, @NotBlank String title, @NotBlank String content,
                        @NotNull Long timestamp, @NotBlank String originator) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
        this.originator = originator;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getOriginator() {
        return originator;
    }

    public void setOriginator(String originator) {
        this.originator = originator;
    }
}
