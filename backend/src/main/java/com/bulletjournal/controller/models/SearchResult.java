package com.bulletjournal.controller.models;

import java.util.List;

public class SearchResult {
    private Long id;
    private ProjectItemType type;
    private String name;
    private List<String> nameHighlights;
    private List<String> contentHighlights;

    public SearchResult() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectItemType getType() {
        return type;
    }

    public void setType(ProjectItemType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
