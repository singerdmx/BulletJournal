package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateLabelParams {

    @NotBlank
    @Size(min = 1, max = 50)
    private String value;

    private String icon;

    public CreateLabelParams() {
    }

    public CreateLabelParams(
            @NotBlank @Size(min = 1, max = 50) String value,
            String icon) {
        this.value = value;
        this.icon = icon;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
