package com.bulletjournal.controller.models;

public class UpdateLabelParams {

    private String value;

    private String icon;

    public UpdateLabelParams() {

    }

    public UpdateLabelParams(String value, String icon) {
        this.value = value;
        this.icon = icon;
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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public boolean hasIcon() {
        return this.icon != null;
    }
}
