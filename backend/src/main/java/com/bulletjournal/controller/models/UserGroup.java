package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserGroup extends User {

    private boolean accepted;

    public UserGroup() {
    }

    public UserGroup(String name, boolean accepted) {
        super(name);
        this.accepted = accepted;
    }

    public UserGroup(String name, String thumbnail, String avatar, boolean accepted, String alias) {
        super(name, thumbnail, avatar);
        this.accepted = accepted;
        this.setAlias(alias);
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
        if (!(o instanceof UserGroup)) return false;
        if (!super.equals(o)) return false;
        UserGroup userGroup = (UserGroup) o;
        return isAccepted() == userGroup.isAccepted();
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), isAccepted());
    }
}
