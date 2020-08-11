package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateCategoryParams {

    @NotNull
    String name;

    @NotNull
    String description;

    public CreateCategoryParams(@NotNull String name, @NotNull String description) {
        this.name = name;
        this.description = description;
    }

    public CreateCategoryParams() {

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
