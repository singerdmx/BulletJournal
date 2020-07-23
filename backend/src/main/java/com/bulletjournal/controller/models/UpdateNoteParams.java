package com.bulletjournal.controller.models;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class UpdateNoteParams {

    private String name;
    private List<Long> labels;

    public UpdateNoteParams() {
    }

    public UpdateNoteParams(String name, List<Long> labels) {
        this.name = name;
        this.labels = labels;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasName() {
        return StringUtils.isNotBlank(this.name);
    }

    public List<Long> getLabels() {
        return labels;
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels;
    }

    public boolean hasLabels() {
        return this.labels != null;
    }
}