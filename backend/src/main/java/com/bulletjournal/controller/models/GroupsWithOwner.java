package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class GroupsWithOwner {

    @NotBlank
    @Size(min = 1, max = 100)
    private String owner;

    private String ownerAvatar;

    @NotNull
    private List<Group> groups = new ArrayList<>();

    public GroupsWithOwner() {
    }

    public GroupsWithOwner(String owner, List<Group> groups) {
        this.owner = owner;
        this.groups = groups;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
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
        if (o == null || getClass() != o.getClass()) return false;
        GroupsWithOwner that = (GroupsWithOwner) o;
        return Objects.equals(owner, that.owner) &&
                Objects.equals(groups, that.groups);
    }

    @Override
    public int hashCode() {
        return Objects.hash(owner, groups);
    }
}
