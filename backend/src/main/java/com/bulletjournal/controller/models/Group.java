package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Group {
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotBlank
    @Size(min = 1, max = 100)
    private String owner;

    private String ownerAvatar;

    private List<UserGroup> users;

    private Boolean isDefault;

    public Group() {
    }

    public Group(Long id,
                 @NotBlank @Size(min = 1, max = 100) String name,
                 @NotBlank @Size(min = 1, max = 100) String owner) {
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

    public List<UserGroup> getUsers() {
        return users;
    }

    public void setUsers(List<UserGroup> users) {
        this.users = users;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    public String getOwnerAvatar() {
        return ownerAvatar;
    }

    public void setOwnerAvatar(String ownerAvatar) {
        this.ownerAvatar = ownerAvatar;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Group)) return false;
        Group group = (Group) o;
        return Objects.equals(getId(), group.getId()) &&
                Objects.equals(getName(), group.getName()) &&
                Objects.equals(getOwner(), group.getOwner()) &&
                Objects.equals(getUsers(), group.getUsers()) &&
                Objects.equals(isDefault, group.isDefault);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getOwner(), getUsers(), isDefault);
    }
}
