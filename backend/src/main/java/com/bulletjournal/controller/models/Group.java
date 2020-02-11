package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Group {
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotBlank
    @Size(min = 1, max = 100)
    private String owner;

    private boolean accepted;

    private List<User> users;

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

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
