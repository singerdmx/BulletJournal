package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateCategoryParams {

    @NotNull
    private String name;

    @NotNull
    private String description;

    private String icon;

    private String color;

    private Long forumId;

    private String image;

    public CreateCategoryParams(@NotNull String name, @NotNull String description) {
        this.name = name;
        this.description = description;
    }

    public CreateCategoryParams() {

    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getForumId() {
        return forumId;
    }

    public void setForumId(Long forumId) {
        this.forumId = forumId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
