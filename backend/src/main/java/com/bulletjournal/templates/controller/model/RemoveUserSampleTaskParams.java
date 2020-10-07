package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class RemoveUserSampleTaskParams {
    @NotBlank
    private Long sampleTaskId;

    public RemoveUserSampleTaskParams() {
    }

    public RemoveUserSampleTaskParams(@NotNull Long sampleTaskId) {
        this.sampleTaskId = sampleTaskId;
    }

    public Long getSampleTaskId() {
        return sampleTaskId;
    }

    public void setSampleTaskId(Long sampleTaskId) {
        this.sampleTaskId = sampleTaskId;
    }
}
