package com.bulletjournal.controller.models;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateNoteParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;
    private List<Long> labels;

    public CreateNoteParams() {
    }

    public CreateNoteParams(@NotBlank @Size(min = 1, max = 100) String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getLabels() {
        return labels;
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels;
    }
}