package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class RemoveUserGroupsParams {
    @NotNull
    private List<RemoveUserGroupParams> userGroups = new ArrayList<>();

    public List<RemoveUserGroupParams> getUserGroups() {
        return userGroups;
    }

    public void setUserGroups(List<RemoveUserGroupParams> userGroups) {
        this.userGroups = userGroups;
    }
}
