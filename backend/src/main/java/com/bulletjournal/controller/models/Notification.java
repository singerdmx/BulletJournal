package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

public class Notification {

    @NotNull
    private Long id;

    @NotBlank
    private String title;

    private String content;

    @NotNull
    private Long timestamp;

    @NotNull
    private User originator;

    private List<String> actions;

    public Notification() {
    }

    public Notification(@NotNull Long id, @NotBlank String title, @NotBlank String content,
                        @NotNull Long timestamp) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
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

    public User getOriginator() {
        return originator;
    }

    public void setOriginator(User originator) {
        this.originator = originator;
    }

    public List<String> getActions() {
        return actions;
    }

    public void setActions(List<String> actions) {
        this.actions = actions;
    }
}
