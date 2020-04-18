package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Content;
import com.google.gson.annotations.Expose;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@MappedSuperclass
public abstract class ContentModel<T extends ProjectItemModel> extends AuditModel {

    @Expose
    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String owner;

    @Expose
    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(columnDefinition = "TEXT")
    private String baseText;

    @Column(columnDefinition = "TEXT")
    private String revisions;

    public abstract Long getId();

    public abstract T getProjectItem();

    public abstract void setProjectItem(T projectItem);

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getBaseText() {
        return baseText;
    }

    public void setBaseText(String baseText) {
        this.baseText = baseText;
    }

    public String getRevisions() {
        return revisions;
    }

    public void setRevisions(String revisions) {
        this.revisions = revisions;
    }

    public Content toPresentationModel() {
        return new Content(
                this.getId(), this.getOwner(), this.getText(),
                this.getBaseText(), this.getCreatedAt() == null ? null : this.getCreatedAt().getTime(),
                this.getUpdatedAt() == null ? null : this.getUpdatedAt().getTime(),
                this.getRevisions());
    }
}
