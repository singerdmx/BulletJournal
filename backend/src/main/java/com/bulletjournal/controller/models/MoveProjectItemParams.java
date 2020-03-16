package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;

public class MoveProjectItemParams {

    @NotNull
    private Long targetProject;

    public MoveProjectItemParams() {
    }

    public MoveProjectItemParams(@NotNull Long targetProject) {
        this.targetProject = targetProject;
    }

    public Long getTargetProject() {
        return targetProject;
    }

    public void setTargetProject(Long targetProject) {
        this.targetProject = targetProject;
    }
}
