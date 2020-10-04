package com.bulletjournal.templates.controller.model;

public class SelectionIntroduction {

    private Selection selection;
    private String imageLink;
    private String description;
    private String title;

    public SelectionIntroduction(Selection selection, String imageLink, String description, String title) {
        this.selection = selection;
        this.imageLink = imageLink;
        this.description = description;
        this.title = title;
    }

    public SelectionIntroduction() {
    }

    public Selection getSelection() {
        return selection;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }

    public String getImageLink() {
        return imageLink;
    }

    public void setImageLink(String imageLink) {
        this.imageLink = imageLink;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
