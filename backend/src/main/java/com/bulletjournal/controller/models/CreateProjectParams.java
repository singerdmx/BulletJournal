package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateProjectParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    public CreateProjectParams() {
    }

    public CreateProjectParams(@NotBlank @Size(min = 1, max = 100) String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
