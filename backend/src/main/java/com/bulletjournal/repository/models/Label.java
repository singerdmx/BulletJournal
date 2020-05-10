package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "labels",
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

    @Column(length = 100)
    private String icon;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public com.bulletjournal.controller.models.Label toPresentationModel() {
        return new com.bulletjournal.controller.models.Label(
                this.getId(), this.getName(), this.getIcon());
    }
}
