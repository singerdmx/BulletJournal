package com.bulletjournal.controller.models;

public class UpdateNoteParams {

    private String name;

    public UpdateNoteParams() {
    }

    public UpdateNoteParams(String name) {
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