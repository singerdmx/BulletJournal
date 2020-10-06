package com.bulletjournal.templates.controller.model;

public class SelectionMetadata {

    private String keyword;
    private Selection selection;
    private Integer frequency;

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }

    public SelectionMetadata() {
    }

    public SelectionMetadata(String keyword, Selection selection, Integer frequency) {
        this.keyword = keyword;
        this.selection = selection;
        this.frequency = frequency;
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
