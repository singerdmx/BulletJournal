package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateNoteParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    public CreateNoteParams() {
    }

    public CreateNoteParams(@NotBlank @Size(min = 1, max = 100) String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}