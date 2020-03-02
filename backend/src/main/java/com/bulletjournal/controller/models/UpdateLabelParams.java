package com.bulletjournal.controller.models;

public class UpdateLabelParams {

    private String value;

    public UpdateLabelParams() {

    }

    public UpdateLabelParams(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean hasValue() {
        return this.value != null;
    }
}
