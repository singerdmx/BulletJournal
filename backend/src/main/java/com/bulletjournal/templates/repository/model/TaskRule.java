package com.bulletjournal.templates.repository.model;

import javax.persistence.Column;

public abstract class TaskRule extends RuleModel {
    @Column(name = "task_ids", nullable = false)
    private String taskIds;

    public String getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(String taskIds) {
        this.taskIds = taskIds;
    }
}
