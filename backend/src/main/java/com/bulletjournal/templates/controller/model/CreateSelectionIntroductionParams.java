package com.bulletjournal.templates.controller.model;

public class CreateSelectionIntroductionParams {
    private String imageLink;
    private String description;
    private String title;

    public CreateSelectionIntroductionParams() {
    }

    public CreateSelectionIntroductionParams(Long selectionId, String imageLink, String description, String title) {
        this.imageLink = imageLink;
        this.description = description;
        this.title = title;
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
