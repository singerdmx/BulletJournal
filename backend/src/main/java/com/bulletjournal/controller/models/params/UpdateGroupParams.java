package com.bulletjournal.controller.models.params;

public class UpdateGroupParams {

    private String name;

    public UpdateGroupParams() {
    }

    public UpdateGroupParams(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasName() {
        return this.name != null;
    }
}
