package com.bulletjournal.repository.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "projects",
        indexes = {@Index(name = "project_owner_index", columnList = "owner")},
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"owner", "name"})
        })
public class Project extends NamedModel {
    @Id
    @GeneratedValue(generator = "project_generator")
    @SequenceGenerator(
            name = "project_generator",
            sequenceName = "project_sequence"
    )
    private Long id;

    @NotNull
    @Column(updatable = false, nullable = false)
    private Integer type;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}