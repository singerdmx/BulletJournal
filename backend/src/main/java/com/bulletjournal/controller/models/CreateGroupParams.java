package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateGroupParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    public CreateGroupParams() {
    }

    public CreateGroupParams(
            @NotBlank @Size(min = 1, max = 100) String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
