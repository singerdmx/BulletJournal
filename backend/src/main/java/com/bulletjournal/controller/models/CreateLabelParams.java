package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;

public class CreateLabelParams {

    @NotBlank
    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
