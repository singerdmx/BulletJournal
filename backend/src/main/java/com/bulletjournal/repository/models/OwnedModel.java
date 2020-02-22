package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@MappedSuperclass
public abstract class OwnedModel extends NamedModel {

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String owner;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
