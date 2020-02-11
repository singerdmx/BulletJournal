package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class Group {
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotBlank
    @Size(min = 1, max = 100)
    private String owner;

    private boolean accepted;

    public Group() {
    }

    public Group(Long id,
                 @NotBlank @Size(min = 1, max = 100) String name,
                 @NotBlank @Size(min = 1, max = 100) String owner) {
        this(id, name, owner, false);
    }

    public Group(Long id,
                 @NotBlank @Size(min = 1, max = 100) String name,
                 @NotBlank @Size(min = 1, max = 100) String owner,
                 boolean accepted) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.accepted = accepted;
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

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}
