package com.bulletjournal.templates.controller.model;

import java.util.ArrayList;
import java.util.List;

public class CreateSampleTaskParams {

    private String name;

    private String content;

    private String metadata;

    private List<Long> stepIds = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public List<Long> getStepIds() {
        return stepIds;
    }

    public void setStepIds(List<Long> stepIds) {
        this.stepIds = stepIds;
    }
}
