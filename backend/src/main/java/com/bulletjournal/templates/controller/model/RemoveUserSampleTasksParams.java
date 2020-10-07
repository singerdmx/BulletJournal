package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;
import java.util.List;

public class RemoveUserSampleTasksParams {
    @NotNull
    private List<Long> sampleTaskIds;

    public RemoveUserSampleTasksParams() {
    }

    public RemoveUserSampleTasksParams(@NotNull List<Long> sampleTaskIds) {
        this.sampleTaskIds = sampleTaskIds;
    }

    public List<Long> getSampleTaskIds() {
        return sampleTaskIds;
    }

    public void setSampleTaskIds(List<Long> sampleTaskIds) {
        this.sampleTaskIds = sampleTaskIds;
    }
}
