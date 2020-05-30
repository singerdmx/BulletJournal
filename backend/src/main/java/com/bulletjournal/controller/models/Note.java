package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Project;
import com.google.gson.annotations.Expose;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Note extends ProjectItem {

    @Expose
    @Valid
    private List<Note> subNotes = new ArrayList<>();

    public Note() {
    }

    public Note(Long id,
                @NotNull User owner,
                @NotBlank String name,
                @NotNull Project project,
                List<Label> labels,
                Long createdAt,
                Long updatedAt) {
        super(id, name, owner, project, labels);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @Override
    public ContentType getContentType() {
        return ContentType.NOTE;
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
        if (!(o instanceof Note)) return false;
        if (!super.equals(o)) return false;
        Note note = (Note) o;
        return Objects.equals(getSubNotes(), note.getSubNotes());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getSubNotes());
    }
}