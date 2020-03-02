package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateLabelParams {

    @NotBlank
    @Size(min = 1, max = 50)
    private String value;

    public CreateLabelParams() {
    }

    public CreateLabelParams(
            @NotBlank @Size(min = 1, max = 50) String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
