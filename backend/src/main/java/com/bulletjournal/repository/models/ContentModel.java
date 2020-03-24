package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class ContentModel<T extends ProjectItemModel> extends AuditModel {

    public abstract Long getId();

    public abstract T getProjectItem();

    @Column(columnDefinition = "TEXT")
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
