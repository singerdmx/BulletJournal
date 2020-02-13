package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CreateTaskParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotNull
    private Long projectId;

    @NotBlank
    @Size(min = 10, max = 10)
    private String dueDate; // "yyyy-MM-dd"

    @NotBlank
    @Size(min = 5, max = 5)
    private String dueTime; // "HH-mm"

    public CreateTaskParams() {
    }

    public CreateTaskParams(@NotBlank @Size(min = 1, max = 100) String name,
                            @NotNull Long projectId,
                            @NotBlank @Size(min = 10, max = 10) String dueDate,
                            @NotBlank @Size(min = 5, max = 5) String dueTime) {
        this.name = name;
        this.projectId = projectId;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getDueTime() {
        return dueTime;
    }

    public void setDueTime(String dueTime) {
        this.dueTime = dueTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
