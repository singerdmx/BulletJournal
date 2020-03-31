package com.bulletjournal.controller.models;


import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotNull;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Revision {

    @NotNull
    private Integer id;

    @NotNull
    private String diff;

    @NotNull
    private Long createdAt;

    public Revision() {}

    public Revision(@NotNull Integer id, @NotNull String diff, @NotNull Long createdAt) {
        this.id = id;
        this.diff = diff;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public String getDiff() {
        return diff;
    }

    public void setId(int id) {
        this.id = id;
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
}
