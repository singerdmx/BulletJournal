package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Content {

    @NotNull
    private Long id;

    @NotBlank
    private String owner;

    private String ownerAvatar;

    @NotBlank
    private String text;

    @NotNull
    private Long createdAt;

    @NotNull
    private Long updatedAt;

    private Revision[] revisions;

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

    public Revision[] getRevisions() {
        return revisions;
    }

    public void setRevisions(Revision[] revisions) {
        this.revisions = revisions;
    }

    public String getOwnerAvatar() {
        return ownerAvatar;
    }

    public void setOwnerAvatar(String ownerAvatar) {
        this.ownerAvatar = ownerAvatar;
    }
}
