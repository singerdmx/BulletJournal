package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateLabelParams {

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    public CreateLabelParams() {
    }

    public CreateLabelParams(
            @NotBlank @Size(min = 1, max = 50) String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
