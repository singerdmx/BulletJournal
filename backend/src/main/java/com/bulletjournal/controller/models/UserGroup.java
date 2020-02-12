package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserGroup extends User {

    private boolean accepted;

    public UserGroup() {
    }

    public UserGroup(String name, boolean accepted) {
        super(name);
        this.accepted = accepted;
    }

    public UserGroup(String name, String thumbnail, String avatar, boolean accepted) {
        super(name, thumbnail, avatar);
        this.accepted = accepted;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

}
