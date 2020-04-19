package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Notification {

    @NotNull
    private Long id;

    @NotBlank
    private String title;

    private String content;

    private String link;

    @NotNull
    private Long timestamp;

    @NotNull
    private User originator;

    private List<String> actions = new ArrayList<>();

    @NotBlank
    private String type;

    public Notification() {
    }

    public Notification(@NotNull Long id, @NotBlank String title, @NotBlank String content,
                        @NotNull Long timestamp, @NotBlank String type, String link) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
        this.type = type;
        this.link = link;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Notification)) return false;
        Notification that = (Notification) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getTitle(), that.getTitle()) &&
                Objects.equals(getContent(), that.getContent()) &&
                Objects.equals(getTimestamp(), that.getTimestamp()) &&
                Objects.equals(getOriginator(), that.getOriginator()) &&
                Objects.equals(getActions(), that.getActions()) &&
                Objects.equals(getType(), that.getType());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle(), getContent(), getTimestamp(), getOriginator(), getActions(), getType());
    }
}
