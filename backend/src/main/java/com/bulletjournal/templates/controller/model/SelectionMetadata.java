package com.bulletjournal.templates.controller.model;

public class SelectionMetadata {

    private String keyword;
    private Selection selection;

    public SelectionMetadata() {
    }

    public SelectionMetadata(String keyword, Selection selection) {
        this.keyword = keyword;
        this.selection = selection;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Selection getSelection() {
        return selection;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }
}
