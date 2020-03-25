package com.bulletjournal.controller;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Content {

    @NotNull
    private Long id;

    @NotBlank
    private String owner;

    @NotBlank
    private String text;

    @NotNull
    private Long createdAt;

    @NotNull
    private Long updatedAt;

    public Content() {
    }

    public Content(@NotNull Long id, @NotBlank String owner,
                   @NotBlank String text, @NotNull Long createdAt, @NotNull Long updatedAt) {
        this.id = id;
        this.owner = owner;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }
}
