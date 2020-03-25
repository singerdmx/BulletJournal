package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;

public class CreateContentParams {

    @NotBlank
    private String text;

    public CreateContentParams() {
    }

    public CreateContentParams(@NotBlank String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
