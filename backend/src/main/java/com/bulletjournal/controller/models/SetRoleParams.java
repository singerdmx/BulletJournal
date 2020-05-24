package com.bulletjournal.controller.models;

import com.bulletjournal.authz.Role;

public class SetRoleParams {

    private Role role;

    public SetRoleParams() {
    }

    public SetRoleParams(Role role) {
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

}