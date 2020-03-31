package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Content;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@MappedSuperclass
public abstract class ContentModel<T extends ProjectItemModel> extends AuditModel {

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String owner;
    @Column(columnDefinition = "TEXT")
    private String text;

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

    public Content toPresentationModel() {
        return new Content(
                this.getId(), this.getOwner(), this.getText(),
                this.getCreatedAt().getTime(), this.getUpdatedAt().getTime());
    }
}
