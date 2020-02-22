package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@MappedSuperclass
public abstract class NamedModel extends AuditModel {

    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
