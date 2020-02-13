package com.bulletjournal.controller.models;

import com.google.gson.annotations.Expose;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Objects;

public class Task {
    @Expose
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String assignedTo;

    @NotBlank
    @Size(min = 10, max = 10)
    private String dueDate;

    @NotBlank
    @Size(min = 5, max = 5)
    private String dueTime;

    @NotNull
    private String name;

    public Task() {
    }

    public Task(Long id,
                @NotBlank @Size(min = 1, max = 100) String assignedTo,
                @NotBlank @Size(min = 10, max = 10) String dueDate,
                @NotBlank @Size(min = 5, max = 5) String dueTime,
                @NotNull String name) {
        this.id = id;
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equals(id, task.id) &&
                Objects.equals(assignedTo, task.assignedTo) &&
                Objects.equals(dueDate, task.dueDate) &&
                Objects.equals(dueTime, task.dueTime) &&
                Objects.equals(name, task.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, assignedTo, dueDate, dueTime, name);
    }
}
