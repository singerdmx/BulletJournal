package com.bulletjournal.repository.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "projects",
        indexes = {@Index(name = "project_owner_index", columnList = "owner", unique = false)})
public class Project extends AuditModel {
    @Id
    @GeneratedValue(generator = "project_generator")
    @SequenceGenerator(
            name = "project_generator",
            sequenceName = "project_sequence"
    )
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    @Column
    private String name;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column
    private String owner;

    public Project() {
    }

    public Project(
            Long id,
            @NotBlank @Size(min = 1, max = 100) String name,
            @NotBlank @Size(min = 2, max = 100) String owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
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

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}