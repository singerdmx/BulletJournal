package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;

public class UpdateContentParams {

    @NotBlank
    private String text;

    public UpdateContentParams() {
    }

    public UpdateContentParams(@NotBlank String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
