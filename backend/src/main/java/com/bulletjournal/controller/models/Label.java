package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Label {
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    public Label() {
    }

    public Label(Long id,
                 @NotBlank @Size(min = 1, max = 100) String name,
                 @NotBlank @Size(min = 1, max = 100) String owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
    }

    @NotBlank
    @Size(min = 1, max = 100)
    private String owner;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
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
}
