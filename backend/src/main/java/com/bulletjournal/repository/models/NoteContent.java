package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "note_contents")
public class NoteContent extends ContentModel<Note> {
    @Id
    @GeneratedValue(generator = "note_content_generator")
    @SequenceGenerator(
            name = "note_content_generator",
            sequenceName = "note_content_sequence",
            initialValue = 200
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "note_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Note note;

    public NoteContent() {
    }

    public NoteContent(String text) {
        this.setText(text);
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public Note getProjectItem() {
        return getNote();
    }

    @Override
    public void setProjectItem(Note projectItem) {
        this.setNote(projectItem);
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }
}
