package com.bulletjournal.controller.models;

import com.bulletjournal.repository.models.Project;
import com.google.gson.annotations.Expose;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Objects;
import java.util.*;

public class Note {
    @Expose
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private Long projectId;

    private List<Label> labels;

    @Expose
    @Valid
    private List<Note> subNotes = new ArrayList<>();

    public Note() {
    }

    public Note(Long id,
                @NotNull String name,
                @NotNull Project project,
                List<Label> labels) {
        this.id = id;
        this.name = name;
        this.projectId = project.getId();
        this.labels = labels;
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

    public List<Note> getSubNotes() {
        return subNotes;
    }

    public void setSubNotes(List<Note> subNotes) {
        this.subNotes = subNotes;
    }

    public void addSubNote(Note note) {
        this.subNotes.add(note);
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
        return Objects.hash(id, name, projectId, subNotes);
    }

    public void clone(Note note) {
        this.setId(note.getId());
        this.setName(note.getName());
        this.setProjectId(note.getProjectId());
    }
}