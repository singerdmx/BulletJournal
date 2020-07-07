package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;

import java.util.ArrayList;
import java.util.List;

public class SearchResultItem {

    private Long id;
    private ContentType type;
    private String name;
    private boolean shared = false;
    private List<String> nameHighlights = new ArrayList<>();
    private List<String> contentHighlights = new ArrayList<>();

    public SearchResultItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ContentType getType() {
        return type;
    }

    public void setType(ContentType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isShared() {
        return shared;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
    }

    public List<String> getNameHighlights() {
        return nameHighlights;
    }

    public void setNameHighlights(List<String> highlights) {
        this.nameHighlights = highlights;
    }

    public void addOrDefaultNameHighlights(List<String> highlights) {
        if (this.nameHighlights == null) {
            setNameHighlights(highlights);
            return;
        }
        this.nameHighlights.addAll(highlights);
    }

    public List<String> getContentHighlights() {
        return contentHighlights;
    }

    public void setContentHighlights(List<String> contentHighlights) {
        this.contentHighlights = contentHighlights;
    }

    public void addOrDefaultContentHighlights(List<String> highlights) {
        if (this.contentHighlights == null) {
            setContentHighlights(highlights);
            return;
        }
        this.contentHighlights.addAll(highlights);
    }

}