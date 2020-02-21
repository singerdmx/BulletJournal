package com.bulletjournal.controller.models;

import com.bulletjournal.repository.models.Project;

import javax.validation.constraints.NotNull;
import java.util.Objects;

public class Note {
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private Long projectId;

    public Note() {
    }

    public Note(Long id,
                @NotNull String name,
                @NotNull Project project) {
        this.id = id;
        this.name = name;
        this.projectId = project.getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Note note = (Note) o;
        return Objects.equals(id, note.id) &&
                Objects.equals(name, note.name) &&
                Objects.equals(projectId, note.projectId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, projectId);
    }
}