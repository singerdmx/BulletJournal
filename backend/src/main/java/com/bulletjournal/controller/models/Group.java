package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.apache.commons.lang3.StringUtils;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Group {
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotNull
    private User owner;

    private List<UserGroup> users;

    private Boolean isDefault;

    public Group() {
    }

    public Group(Long id,
                 @NotBlank @Size(min = 1, max = 100) String name,
                 @NotNull User owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
    }

    public static List<Group> addOwnerAvatar(List<Group> groups, UserClient userClient) {
        groups.forEach(g -> addOwnerAvatar(g, userClient));
        return groups;
    }

    public static Group addOwnerAvatar(Group group, UserClient userClient) {
        if (group == null) {
            return null;
        }
        if (group.getOwner() != null && StringUtils.isNotBlank(group.getOwner().getName())) {
            group.setOwner(userClient.getUser(group.getOwner().getName()));
        }
        if (group.getUsers() != null) {
            for (UserGroup userGroup : group.getUsers()) {
                String username = userGroup.getName();
                if (StringUtils.isBlank(username)) {
                    continue;
                }
                User user = userClient.getUser(username);
                userGroup.setAlias(user.getAlias());
                userGroup.setAvatar(user.getAvatar());
                userGroup.setThumbnail(user.getThumbnail());
            }
        }
        return group;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
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
