package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "note_auditables")
public class NoteAuditable {

    @EmbeddedId
    private NoteAuditableKey id;

    @ManyToOne
    @MapsId("note_id")
    @JoinColumn(name = "note_id")
    private Note note;

    @ManyToOne
    @MapsId("auditable_id")
    @JoinColumn(name = "auditable_id")
    private Auditable auditable;

    public NoteAuditable() {
    }

    public NoteAuditableKey getId() {
        return id;
    }

    public void setId(NoteAuditableKey id) {
        this.id = id;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public Auditable getAuditable() {
        return auditable;
    }

    public void setAuditable(Auditable auditable) {
        this.auditable = auditable;
    }
}
