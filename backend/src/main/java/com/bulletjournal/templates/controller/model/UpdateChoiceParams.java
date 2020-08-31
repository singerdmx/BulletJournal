package com.bulletjournal.templates.controller.model;

public class UpdateChoiceParams {
    private String name;

    private boolean multiple;

    public UpdateChoiceParams() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }
}
