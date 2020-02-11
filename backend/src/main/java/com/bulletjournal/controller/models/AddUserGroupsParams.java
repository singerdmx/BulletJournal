package com.bulletjournal.controller.models;

import java.util.List;

public class AddUserGroupsParams {
    private List<AddUserGroupParams> userGroups;

    public List<AddUserGroupParams> getUserGroups() {
        return userGroups;
    }

    public void setUserGroups(List<AddUserGroupParams> userGroups) {
        this.userGroups = userGroups;
    }
}
