package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class GroupsWithOwner {

    private User owner;

    @NotNull
    private List<Group> groups = new ArrayList<>();

    public GroupsWithOwner() {
    }

    public GroupsWithOwner(User owner, List<Group> groups) {
        this.owner = owner;
        this.groups = groups;
    }

    public static List<GroupsWithOwner> addOwnerAvatar(List<GroupsWithOwner> groups, UserClient userClient) {
        groups.forEach(g -> addOwnerAvatar(g, userClient));
        return groups;
    }

    public static GroupsWithOwner addOwnerAvatar(GroupsWithOwner groups, UserClient userClient) {
        groups.setOwner(userClient.getUser(groups.getOwner().getName()));
        Group.addOwnerAvatar(groups.groups, userClient);
        return groups;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
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
