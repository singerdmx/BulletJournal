package com.bulletjournal.controller.models.params;

import javax.validation.constraints.NotBlank;

public class UpdateContentParams {

    @NotBlank
    private String text;

    private String diff;

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

    public String getDiff() {
        return diff;
    }

    public void setDiff(String diff) {
        this.diff = diff;
    }
}
