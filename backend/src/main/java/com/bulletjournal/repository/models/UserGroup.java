package com.bulletjournal.repository.models;

import com.bulletjournal.repository.auditing.UserGroupEntityListeners;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "user_groups")
@EntityListeners(value = {UserGroupEntityListeners.class})
public class UserGroup {

    @EmbeddedId
    private UserGroupKey id;

    @ManyToOne
    @MapsId("user_id")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("group_id")
    @JoinColumn(name = "group_id")
    private Group group;

    private boolean accepted;

    public UserGroup() {
    }

    public UserGroup(User user, Group group) {
        this(user, group, false);
    }

    public UserGroup(User user, Group group, boolean accepted) {
        this.user = user;
        this.group = group;
        this.accepted = accepted;
        this.id = new UserGroupKey(user.getId(), group.getId());
    }

    public UserGroupKey getId() {
        return id;
    }

    public void setId(UserGroupKey id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserGroup userGroup = (UserGroup) o;
        return Objects.equals(user, userGroup.user) &&
                Objects.equals(group, userGroup.group);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, group);
    }
}
