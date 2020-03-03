package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "labels",
        indexes = {@Index(name = "label_owner_index", columnList = "owner"),
                @Index(name = "label_owner_name_index", columnList = "owner, name")},
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"owner", "name"})
        })
public class Label extends OwnedModel {

    @Id
    @GeneratedValue(generator = "label_generator")
    @SequenceGenerator(
            name = "label_generator",
            sequenceName = "label_sequence",
            initialValue = 100
    )
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public com.bulletjournal.controller.models.Label toPresentationModel() {
        return new com.bulletjournal.controller.models.Label(
                this.getId(), this.getName());
    }
}
