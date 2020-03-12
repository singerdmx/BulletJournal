package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;

public class MoveTaskParams {

    @NotNull
    private Long targetProject;

    public MoveTaskParams() {
    }

    public MoveTaskParams(@NotNull Long targetProject) {
        this.targetProject = targetProject;
    }

    public Long getTargetProject() {
        return targetProject;
    }

    public void setTargetProject(Long targetProject) {
        this.targetProject = targetProject;
    }
}
