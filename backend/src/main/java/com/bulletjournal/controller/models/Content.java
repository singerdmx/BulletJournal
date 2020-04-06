package com.bulletjournal.controller.models;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Content {

    private static final Gson GSON = new GsonBuilder().create();

    @NotNull
    private Long id;

    @NotBlank
    private String owner;

    private String ownerAvatar;

    @NotBlank
    private String text;

    private String baseText;

    @NotNull
    private Long createdAt;

    @NotNull
    private Long updatedAt;

    private Revision[] revisions;

    public Content() {
    }

    public Content(@NotNull Long id, @NotBlank String owner,
                   @NotBlank String text, String baseText,
                   @NotNull Long createdAt, @NotNull Long updatedAt,
                   String revisions) {
        this.id = id;
        this.owner = owner;
        this.text = text;
        this.baseText = baseText;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.revisions = GSON.fromJson(revisions, Revision[].class);
        deleteRevisionDiff();
    }

    private void deleteRevisionDiff() {
        if (revisions != null) {
            for (Revision revision : revisions) {
                revision.setDiff(null);
            }
        }
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

    public String getBaseText() {
        return baseText;
    }

    public void setBaseText(String baseText) {
        this.baseText = baseText;
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
