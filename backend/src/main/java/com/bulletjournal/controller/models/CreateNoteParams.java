package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CreateNoteParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotNull
    private Long projectId;

    public CreateNoteParams() {
    }

    public CreateNoteParams(@NotBlank @Size(min = 1, max = 100) String name,
                            @NotNull Long projectId) {
        this.name = name;
        this.projectId = projectId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}