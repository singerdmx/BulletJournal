package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Label;

import javax.persistence.*;
import java.util.Collections;
import java.util.List;

/**
 * This class is for ProjectType.NOTE
 */
@Entity
@Table(name = "notes")
public class Note extends ProjectItemModel {
    @Id
    @GeneratedValue(generator = "note_generator")
    @SequenceGenerator(
            name = "note_generator",
            sequenceName = "note_sequence",
            initialValue = 200
    )
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public com.bulletjournal.controller.models.Note toPresentationModel() {
        return toPresentationModel(Collections.emptyList());
    }

    public com.bulletjournal.controller.models.Note toPresentationModel(
            List<Label> labels) {
        return new com.bulletjournal.controller.models.Note(
                this.getId(),
                this.getName(),
                this.getProject(),
                labels);
    }
}
