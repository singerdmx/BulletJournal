package com.bulletjournal.controller.models;

import java.util.List;

public class SearchResult {
    private String id;
    private List<String> highlights;

    public SearchResult() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getHighlights() {
        return highlights;
    }

    public void setHighlights(List<String> highlights) {
        this.highlights = highlights;
    }
}
