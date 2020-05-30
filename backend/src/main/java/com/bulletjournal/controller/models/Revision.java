package com.bulletjournal.controller.models;


import com.bulletjournal.clients.UserClient;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotNull;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Revision {

    @NotNull
    private Long id;

    private String diff;

    private String content;

    @NotNull
    private Long createdAt;

    @NotNull
    private User user;

    public Revision() {

    }

    public Revision(@NotNull Long id, String diff, @NotNull Long createdAt, @NotNull User user) {
        this.id = id;
        this.diff = diff;
        this.createdAt = createdAt;
        this.user = user;
    }

    public static List<Revision> addAvatar(List<Revision> revisions, UserClient userClient) {
        revisions.forEach(r -> addAvatar(r, userClient));
        return revisions;
    }

    public static Revision addAvatar(Revision revision, UserClient userClient) {
        revision.setUser(userClient.getUser(revision.getUser().getName()));
        return revision;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDiff() {
        return diff;
    }

    public void setDiff(String diff) {
        this.diff = diff;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
