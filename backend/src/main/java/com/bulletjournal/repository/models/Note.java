package com.bulletjournal.repository.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.User;

import javax.persistence.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * This class is for ProjectType.NOTE
 */
@Entity
@Table(name = "notes")
public class Note extends ProjectItemModel<com.bulletjournal.controller.models.Note> {
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

    @Override
    public com.bulletjournal.controller.models.Note toPresentationModel() {
        return toPresentationModel(this.getLabels().stream()
                .map(Label::new)
                .collect(Collectors.toList()));
    }

    @Override
    public com.bulletjournal.controller.models.Note toPresentationModel(List<Label> labels) {
        return new com.bulletjournal.controller.models.Note(
                this.getId(),
                new User(this.getOwner()),
                this.getName(),
                this.getProject(),
                labels,
                this.getCreatedAt().getTime(),
                this.getUpdatedAt().getTime());
    }

    @Override
    public ContentType getContentType() {
        return ContentType.NOTE;
    }
}
