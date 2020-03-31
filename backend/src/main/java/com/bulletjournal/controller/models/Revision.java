package com.bulletjournal.controller.models;


import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotNull;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Revision {

    @NotNull
    private Integer id;

    private String diff;

    @NotNull
    private Long createdAt;

    @NotNull
    private String user;

    public Revision() {

    }

    public Revision(@NotNull Integer id, String diff, @NotNull Long createdAt, @NotNull String username) {
        this.id = id;
        this.diff = diff;
        this.createdAt = createdAt;
        this.user = username;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getId() {
        return id;
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

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
