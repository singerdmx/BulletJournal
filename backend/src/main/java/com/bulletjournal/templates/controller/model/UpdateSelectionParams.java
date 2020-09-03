package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class UpdateSelectionParams {

    private String icon;

    @NotNull
    private String text;

    public UpdateSelectionParams(@NotNull String icon, String text) {
        this.icon = icon;
        this.text = text;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
