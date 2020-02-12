package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class AddUserGroupsParams {
    @NotNull
    private List<AddUserGroupParams> userGroups = new ArrayList<>();

    public List<AddUserGroupParams> getUserGroups() {
        return userGroups;
    }

    public void setUserGroups(List<AddUserGroupParams> userGroups) {
        this.userGroups = userGroups;
    }
}
