package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateStepParams {

    @NotNull
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
