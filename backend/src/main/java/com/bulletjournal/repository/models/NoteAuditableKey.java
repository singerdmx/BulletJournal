package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class NoteAuditableKey implements Serializable {

    @NotNull
    @Column(name = "note_id")
    private Long noteId;

    @NotNull
    @Column(name = "auditable_id")
    private Long auditableId;

    public NoteAuditableKey() {
    }

    public NoteAuditableKey(@NotNull Long noteId, @NotNull Long auditableId) {
        this.noteId = noteId;
        this.auditableId = auditableId;
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public Long getAuditableId() {
        return auditableId;
    }

    public void setAuditableId(Long auditableId) {
        this.auditableId = auditableId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NoteAuditableKey)) return false;
        NoteAuditableKey that = (NoteAuditableKey) o;
        return Objects.equals(getNoteId(), that.getNoteId()) && Objects.equals(getAuditableId(), that.getAuditableId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getNoteId(), getAuditableId());
    }
}
